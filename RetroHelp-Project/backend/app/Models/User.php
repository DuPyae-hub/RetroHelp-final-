<?php

namespace App\Models;

use App\Support\RoleId;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nickname',
        'full_name',
        'password',
        'role_id',
        'is_verified',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_verified' => 'boolean',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function navigations(): HasMany
    {
        return $this->hasMany(Navigation::class, 'user_id');
    }

    public function pillDispensesAsPatient(): HasMany
    {
        return $this->hasMany(PillDispense::class, 'patient_id');
    }

    public function pillDispensesAsStaff(): HasMany
    {
        return $this->hasMany(PillDispense::class, 'staff_id');
    }

    public function isPatient(): bool
    {
        return (int) $this->role_id === RoleId::Patient;
    }

    public function isClinicStaff(): bool
    {
        return (int) $this->role_id === RoleId::ClinicStaff;
    }

    public function isAdmin(): bool
    {
        return (int) $this->role_id === RoleId::Admin;
    }
}
