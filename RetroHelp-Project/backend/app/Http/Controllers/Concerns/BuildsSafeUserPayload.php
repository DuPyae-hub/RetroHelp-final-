<?php

namespace App\Http\Controllers\Concerns;

use App\Models\User;
use App\Support\RoleId;

trait BuildsSafeUserPayload
{
    /**
     * @return array<string, mixed>
     */
    protected function safeUserPayload(User $user): array
    {
        $user->loadMissing('role:id,role_name');

        $payload = [
            'id' => $user->id,
            'role_id' => $user->role_id,
            'is_verified' => (bool) $user->is_verified,
            'role' => $user->role !== null
                ? ['id' => $user->role->id, 'role_name' => $user->role->role_name]
                : null,
        ];

        if ((int) $user->role_id === RoleId::Patient) {
            $payload['nickname'] = $user->nickname;

            return $payload;
        }

        $payload['nickname'] = $user->nickname;
        $payload['full_name'] = $user->full_name;

        return $payload;
    }
}
