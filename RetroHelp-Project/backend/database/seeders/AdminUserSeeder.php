<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\RoleId;
use Illuminate\Database\Seeder;

/**
 * Creates or updates one administrator from .env for first-time setup.
 * Set RETROHELP_ADMIN_PASSWORD (and optionally RETROHELP_ADMIN_FULL_NAME), then run:
 * php artisan db:seed --class=AdminUserSeeder
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = trim((string) config('retrohelp.admin_password', ''));
        if ($password === '') {
            $this->command?->warn(
                'AdminUserSeeder skipped: set RETROHELP_ADMIN_PASSWORD in .env to create an admin account.',
            );

            return;
        }

        $fullName = trim((string) config('retrohelp.admin_full_name', 'RetroHelp Admin'));
        if ($fullName === '') {
            $fullName = 'RetroHelp Admin';
        }

        $user = User::query()->firstOrNew([
            'role_id' => RoleId::Admin,
            'full_name' => $fullName,
        ]);

        $user->fill([
            'password' => $password,
            'is_verified' => true,
            'nickname' => null,
            'art_center_id' => null,
        ]);
        $user->save();

        $this->command?->info('Administrator ready: full name "'.$fullName.'" (use Staff tab, Administrator sign-in).');
    }
}
