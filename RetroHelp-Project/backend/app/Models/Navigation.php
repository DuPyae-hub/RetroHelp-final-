<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Navigation extends Model
{
    protected $primaryKey = 'navigation_id';

    protected $fillable = [
        'user_id',
        'start_location',
        'destination',
        'art_center_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function artCenter(): BelongsTo
    {
        return $this->belongsTo(ArtCenter::class, 'art_center_id');
    }

    public function pillDispenses(): HasMany
    {
        return $this->hasMany(PillDispense::class, 'navigation_id', 'navigation_id');
    }
}
