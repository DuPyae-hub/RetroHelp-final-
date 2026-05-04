<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'clinic_id',
        'booking_id',
        'rating',
        'comment',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(ArtCenter::class, 'clinic_id');
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }
}
