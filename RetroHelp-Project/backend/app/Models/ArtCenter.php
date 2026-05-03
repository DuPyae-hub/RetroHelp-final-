<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ArtCenter extends Model
{
    protected $fillable = [
        'name',
        'image',
        'latitude',
        'longitude',
        'contact_no',
        'is_verified',
        'township',
        'area',
        'rating_avg',
        'total_reviews',
    ];

    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'rating_avg' => 'decimal:2',
        ];
    }

    public function pillDispenses(): HasMany
    {
        return $this->hasMany(PillDispense::class, 'art_center_id');
    }

    public function navigations(): HasMany
    {
        return $this->hasMany(Navigation::class, 'art_center_id');
    }
}
