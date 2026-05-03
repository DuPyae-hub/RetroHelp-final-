<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\BuildsSafeUserPayload;
use App\Models\User;
use App\Support\RoleId;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use BuildsSafeUserPayload;

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
            'is_verified' => false,
        ]);

        return $this->tokenResponse($user, 'patient');
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

        $user->tokens()->delete();

        return $this->tokenResponse($user, 'patient');
    }

    public function loginStaff(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $candidates = User::query()
            ->where('full_name', $credentials['full_name'])
            ->whereIn('role_id', [RoleId::ClinicStaff, RoleId::Admin])
            ->get();

        $user = $candidates->first(static function (User $u) use ($credentials): bool {
            return Hash::check($credentials['password'], $u->password);
        });

        if ($user === null) {
            throw ValidationException::withMessages([
                'full_name' => [__('auth.failed')],
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
