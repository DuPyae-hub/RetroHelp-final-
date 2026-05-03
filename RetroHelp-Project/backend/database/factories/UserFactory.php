<?php

namespace Database\Factories;

use App\Support\RoleId;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'nickname' => fake()->unique()->userName(),
            'full_name' => null,
            'password' => static::$password ??= Hash::make('password'),
            'role_id' => RoleId::Patient,
            'is_verified' => false,
        ];
    }

    public function staff(): static
    {
        return $this->state(fn (array $attributes) => [
            'nickname' => null,
            'full_name' => fake()->name(),
            'role_id' => RoleId::ClinicStaff,
            'is_verified' => true,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'nickname' => fake()->unique()->userName(),
            'full_name' => null,
            'role_id' => RoleId::Admin,
            'is_verified' => true,
        ]);
    }
}
