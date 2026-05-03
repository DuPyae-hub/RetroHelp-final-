<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PillDispense extends Model
{
    protected $primaryKey = 'dispense_id';

    protected $fillable = [
        'patient_id',
        'staff_id',
        'status',
        'dispense_date',
        'art_center_id',
        'navigation_id',
    ];

    protected function casts(): array
    {
        return [
            'dispense_date' => 'datetime',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function artCenter(): BelongsTo
    {
        return $this->belongsTo(ArtCenter::class, 'art_center_id');
    }

    public function navigation(): BelongsTo
    {
        return $this->belongsTo(Navigation::class, 'navigation_id', 'navigation_id');
    }

    public function getRouteKeyName(): string
    {
        return 'dispense_id';
    }
}
