<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\RoleId;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
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
        $user = $request->user();
        $user->load('role:id,role_name');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'nickname' => $user->nickname,
                'full_name' => $user->full_name,
                'role_id' => $user->role_id,
                'is_verified' => $user->is_verified,
                'role' => $user->role,
            ],
        ]);
    }

    private function tokenResponse(User $user, string $tokenName): JsonResponse
    {
        $token = $user->createToken($tokenName)->plainTextToken;
        $user->load('role:id,role_name');

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'nickname' => $user->nickname,
                'full_name' => $user->full_name,
                'role_id' => $user->role_id,
                'is_verified' => $user->is_verified,
                'role' => $user->role,
            ],
        ]);
    }
}
