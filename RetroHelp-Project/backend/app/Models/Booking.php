<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Schema;

class Booking extends Model
{
    public const STATUS_REQUESTED = 'requested';

    public const STATUS_ACCEPTED = 'accepted';

    public const STATUS_ON_MY_WAY = 'on_my_way';

    public const STATUS_ARRIVED = 'arrived';

    public const STATUS_PILL_GIVEN = 'pill_given';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    public const CANCEL_NO_PATIENT_COMING = 'no_patient_coming_confirmation';

    public const CANCELLED_BY_PATIENT = 'cancelled_by_patient';

    public const CANCELLED_BY_CLINIC = 'cancelled_by_clinic';

    protected $fillable = [
        'user_id',
        'art_center_id',
        'staff_id',
        'navigation_id',
        'status',
        'patient_note',
        'accepted_at',
        'respond_by_at',
        'cancelled_at',
        'cancellation_reason',
        'pill_stock_deducted',
    ];

    /**
     * Accepted bookings where the patient never confirmed they are coming before the deadline.
     */
    public static function expireAcceptedPastDeadline(): int
    {
        if (! Schema::hasTable('bookings') || ! Schema::hasColumn('bookings', 'respond_by_at')) {
            return 0;
        }

        $payload = [
            'status' => self::STATUS_CANCELLED,
            'cancellation_reason' => self::CANCEL_NO_PATIENT_COMING,
        ];
        if (Schema::hasColumn('bookings', 'cancelled_at')) {
            $payload['cancelled_at'] = now();
        }

        return static::query()
            ->where('status', self::STATUS_ACCEPTED)
            ->whereNotNull('respond_by_at')
            ->where('respond_by_at', '<', now())
            ->update($payload);
    }

    protected function casts(): array
    {
        return [
            'accepted_at' => 'datetime',
            'respond_by_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'pill_stock_deducted' => 'boolean',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function artCenter(): BelongsTo
    {
        return $this->belongsTo(ArtCenter::class, 'art_center_id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function navigation(): BelongsTo
    {
        return $this->belongsTo(Navigation::class, 'navigation_id', 'navigation_id');
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class, 'booking_id');
    }
}
