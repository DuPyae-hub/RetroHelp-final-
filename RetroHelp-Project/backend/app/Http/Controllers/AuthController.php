<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\BuildsSafeUserPayload;
use App\Models\ArtCenter;
use App\Models\User;
use App\Support\RoleId;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use BuildsSafeUserPayload;

    /**
     * Register as a community member (immediate access) or clinic staff (requires admin approval).
     */
    public function register(Request $request): JsonResponse
    {
        $accountType = $request->validate([
            'account_type' => ['required', Rule::in(['patient', 'clinic_staff'])],
        ])['account_type'];

        if ($accountType === 'patient') {
            return $this->registerPatient($request);
        }

        return $this->registerClinicStaffPending($request);
    }

    public function registerPatient(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nickname' => ['required', 'string', 'max:255', 'unique:users,nickname'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::query()->create([
            'nickname' => $data['nickname'],
            'password' => $data['password'],
            'role_id' => RoleId::Patient,
            'is_verified' => true,
        ]);

        return $this->tokenResponse($user, 'patient');
    }

    /**
     * Self-service clinic staff signup: account exists but cannot sign in until an admin sets is_verified.
     */
    public function registerClinicStaffPending(Request $request): JsonResponse
    {
        $request->merge([
            'nickname' => trim((string) $request->input('nickname', '')) ?: null,
        ]);

        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255', 'unique:users,full_name'],
            'nickname' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('users', 'nickname'),
            ],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'art_center_id' => ['nullable', 'integer', 'exists:art_centers,id'],
            'new_center' => ['nullable', 'array'],
            'new_center.name' => ['nullable', 'string', 'max:255'],
            'new_center.township' => ['nullable', 'string', 'max:255'],
            'new_center.area' => ['nullable', 'string', 'max:255'],
            'new_center.contact_no' => ['nullable', 'string', 'max:255'],
            'new_center.image' => ['nullable', 'string', 'max:255'],
            'new_center.latitude' => ['nullable', 'numeric'],
            'new_center.longitude' => ['nullable', 'numeric'],
        ]);

        $existingCenterId = $request->filled('art_center_id')
            ? (int) $data['art_center_id']
            : null;
        $newCenterName = trim((string) ($data['new_center']['name'] ?? ''));

        if ($existingCenterId !== null && $newCenterName !== '') {
            throw ValidationException::withMessages([
                'art_center_id' => ['Choose either an existing clinic or a new clinic listing, not both.'],
            ]);
        }

        if ($existingCenterId === null && $newCenterName === '') {
            throw ValidationException::withMessages([
                'art_center_id' => ['Select your clinic from the list or complete the new clinic listing fields (name, township, area, and contact number).'],
            ]);
        }

        $artCenterId = $existingCenterId;

        if ($artCenterId === null) {
            $nc = $data['new_center'] ?? [];
            Validator::make($nc, [
                'name' => ['required', 'string', 'max:255'],
                'township' => ['required', 'string', 'max:255'],
                'area' => ['required', 'string', 'max:255'],
                'contact_no' => ['required', 'string', 'max:255'],
                'image' => ['nullable', 'string', 'max:255'],
                'latitude' => ['nullable', 'numeric'],
                'longitude' => ['nullable', 'numeric'],
            ])->validate();

            $baseSlug = Str::slug((string) $nc['name']);
            if ($baseSlug === '') {
                $baseSlug = 'clinic';
            }
            $nickname = $baseSlug;
            $suffix = 0;
            while (ArtCenter::query()->where('nickname', $nickname)->exists()) {
                $suffix++;
                $nickname = $baseSlug.'-'.$suffix;
            }

            $center = ArtCenter::query()->create([
                'name' => $nc['name'],
                'nickname' => $nickname,
                'role_id' => RoleId::ClinicStaff,
                'township' => $nc['township'],
                'area' => $nc['area'],
                'contact_no' => $nc['contact_no'],
                'image' => $nc['image'] ?? null,
                'latitude' => $nc['latitude'] ?? null,
                'longitude' => $nc['longitude'] ?? null,
                'is_verified' => false,
            ]);
            $artCenterId = $center->id;
        }

        User::query()->create([
            'nickname' => $data['nickname'],
            'full_name' => $data['full_name'],
            'password' => $data['password'],
            'role_id' => RoleId::ClinicStaff,
            'art_center_id' => $artCenterId,
            'is_verified' => false,
        ]);

        return response()->json([
            'message' => 'Registration received. An administrator must approve your clinic staff account before you can sign in.',
            'pending_approval' => true,
        ], 201);
    }

    public function loginPatient(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'nickname' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()
            ->where('nickname', $credentials['nickname'])
            ->where('role_id', RoleId::Patient)
            ->first();

        if ($user === null || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'nickname' => [__('auth.failed')],
            ]);
        }

        if (! $user->is_verified) {
            throw ValidationException::withMessages([
                'nickname' => [__('This account is not active yet.')],
            ]);
        }

        $user->tokens()->delete();

        return $this->tokenResponse($user, 'patient');
    }

    public function loginStaff(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
            'art_center_id' => ['nullable', 'integer', 'exists:art_centers,id'],
            'art_center_nickname' => ['nullable', 'string', 'max:255'],
            'admin_login' => ['sometimes', 'boolean'],
        ]);

        $intentAdmin = $request->boolean('admin_login');

        /** @var int|null Clinic chosen at sign-in; used to back-fill staff.art_center_id when it was null */
        $loginCenterId = null;

        $fullNameNorm = Str::lower(trim($credentials['full_name']));

        $candidates = User::query()
            ->whereIn('role_id', [RoleId::ClinicStaff, RoleId::Admin])
            ->get()
            ->filter(static function (User $u) use ($fullNameNorm): bool {
                $fn = Str::lower(trim((string) ($u->full_name ?? '')));
                if ($fn === $fullNameNorm) {
                    return true;
                }

                // Admins created in phpMyAdmin often have display name in `nickname` only (`full_name` NULL).
                if ((int) $u->role_id === RoleId::Admin) {
                    $nick = Str::lower(trim((string) ($u->nickname ?? '')));

                    return $nick !== '' && $nick === $fullNameNorm;
                }

                return false;
            });

        if ($candidates->isEmpty()) {
            throw ValidationException::withMessages([
                'full_name' => [
                    $intentAdmin
                        ? 'No administrator or clinic staff account uses this name. For administrators: type the same full name or nickname stored on the user row (trimmed, case-insensitive). Seeded admins use RETROHELP_ADMIN_FULL_NAME, often "RetroHelp Admin".'
                        : 'No clinic staff or administrator account uses this full name. Check spelling and extra spaces, or enable "Administrator sign-in" if you are using an admin account.',
                ],
            ]);
        }

        $matches = $candidates->filter(static function (User $u) use ($credentials): bool {
            return Hash::check($credentials['password'], $u->password);
        });

        if ($matches->isEmpty()) {
            throw ValidationException::withMessages([
                'password' => [
                    $intentAdmin
                        ? 'That password does not match this full name for an administrator. Use the password from RETROHELP_ADMIN_PASSWORD in .env after running php artisan db:seed --class=AdminUserSeeder.'
                        : 'That password does not match this full name. If you are an administrator, turn on "Administrator sign-in" and use the password from your server .env (RETROHELP_ADMIN_PASSWORD).',
                ],
            ]);
        }

        $admin = $matches->first(static fn (User $u): bool => (int) $u->role_id === RoleId::Admin);

        if ($intentAdmin && $admin === null) {
            throw ValidationException::withMessages([
                'full_name' => [
                    'This name and password belong to a clinic staff account, not an administrator. Turn off "Administrator sign-in", choose your clinic, and try again—or use your administrator full name or nickname from the database (or RETROHELP_ADMIN_FULL_NAME after seeding).',
                ],
            ]);
        }

        if ($admin !== null) {
            $user = $admin;
        } else {
            $centerId = $credentials['art_center_id'] ?? null;
            if ($centerId === null && ! empty($credentials['art_center_nickname'])) {
                $center = ArtCenter::query()->where('nickname', $credentials['art_center_nickname'])->first();
                if ($center === null) {
                    throw ValidationException::withMessages([
                        'art_center_nickname' => [__('No clinic matches that nickname.')],
                    ]);
                }
                $centerId = $center->id;
            }

            if ($centerId === null) {
                throw ValidationException::withMessages([
                    'art_center_id' => [__('Choose your clinic or enter its nickname.')],
                ]);
            }

            $exact = $matches->first(static function (User $u) use ($centerId): bool {
                return (int) $u->role_id === RoleId::ClinicStaff
                    && $u->art_center_id !== null
                    && (int) $u->art_center_id === (int) $centerId;
            });

            if ($exact !== null) {
                $user = $exact;
            } else {
                $legacy = $matches->filter(static function (User $u): bool {
                    return (int) $u->role_id === RoleId::ClinicStaff && $u->art_center_id === null;
                });
                if ($legacy->count() === 1) {
                    $user = $legacy->first();
                } else {
                    throw ValidationException::withMessages([
                        'art_center_id' => [
                            'No clinic staff account with this full name is linked to the clinic you selected. Pick the same clinic you registered with, or ask an administrator to link your account.',
                        ],
                    ]);
                }
            }

            $loginCenterId = (int) $centerId;
        }

        if ($user->isClinicStaff()
            && $user->art_center_id === null
            && $loginCenterId !== null
            && $loginCenterId > 0) {
            $user->forceFill(['art_center_id' => $loginCenterId])->save();
            $user->refresh();
            $user->loadMissing(['role:id,role_name', 'artCenter:id,name,nickname']);
        }

        if ((int) $user->role_id === RoleId::ClinicStaff && ! $user->is_verified) {
            throw ValidationException::withMessages([
                'full_name' => [__('Your clinic staff account is waiting for administrator approval.')],
            ]);
        }

        $user->tokens()->delete();

        return $this->tokenResponse($user, 'staff');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->safeUserPayload($request->user()),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if ((int) $user->role_id !== RoleId::Patient) {
            abort(403, 'Only community member accounts may update a nickname here.');
        }

        $data = $request->validate([
            'nickname' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'nickname')->ignore($user->id),
            ],
        ]);

        $user->update(['nickname' => $data['nickname']]);

        return response()->json([
            'message' => 'Profile updated.',
            'user' => $this->safeUserPayload($user->fresh()),
        ]);
    }

    private function tokenResponse(User $user, string $tokenName): JsonResponse
    {
        $token = $user->createToken($tokenName)->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->safeUserPayload($user),
        ]);
    }
}
