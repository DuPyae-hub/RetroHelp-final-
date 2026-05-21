<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ArtCenter extends Model
{
    protected $table = 'art_centers';

    protected $fillable = [
        'name',
        'nickname',
        'role_id',
        'image',
        'latitude',
        'longitude',
        'contact_no',
        'is_verified',
        'art_pills_available',
        'art_pills_count',
        'township',
        'area',
        'rating_avg',
        'total_reviews',
    ];

    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
            'art_pills_available' => 'boolean',
            'art_pills_count' => 'integer',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'rating_avg' => 'decimal:2',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function navigations(): HasMany
    {
        return $this->hasMany(Navigation::class, 'art_center_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'art_center_id');
    }

    /**
     * Reduce 3-month supply count by one after a completed pill handout.
     * Sets art_pills_available to false when count reaches zero.
     */
    public function decrementPillSupply(int $amount = 1): void
    {
        $amount = max(1, $amount);
        $current = max(0, (int) $this->art_pills_count);
        $next = max(0, $current - $amount);

        $this->update([
            'art_pills_count' => $next,
            'art_pills_available' => $next > 0,
        ]);
    }
}
