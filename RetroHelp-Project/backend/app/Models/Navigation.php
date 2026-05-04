<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Navigation extends Model
{
    protected $table = 'navigations';

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
}
