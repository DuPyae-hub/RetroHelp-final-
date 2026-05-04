<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\BuildsSafeUserPayload;
use App\Models\User;
use App\Support\RoleId;
use Illuminate\Http\JsonResponse;

class AdminClinicStaffController extends Controller
{
    use BuildsSafeUserPayload;

    /**
     * Clinic staff accounts awaiting admin approval.
     */
    public function pending(): JsonResponse
    {
        $users = User::query()
            ->where('role_id', RoleId::ClinicStaff)
            ->where('is_verified', false)
            ->orderBy('created_at')
            ->get(['id', 'full_name', 'created_at']);

        return response()->json([
            'data' => $users,
        ]);
    }

    /**
     * Approve a pending clinic staff registration.
     */
    public function approve(User $user): JsonResponse
    {
        if ((int) $user->role_id !== RoleId::ClinicStaff) {
            abort(422, 'Only clinic staff accounts can be approved here.');
        }

        if ($user->is_verified) {
            return response()->json([
                'message' => 'This account is already approved.',
                'user' => $this->safeUserPayload($user),
            ]);
        }

        $user->update(['is_verified' => true]);

        return response()->json([
            'message' => 'Clinic staff account approved.',
            'user' => $this->safeUserPayload($user->fresh()),
        ]);
    }
}
