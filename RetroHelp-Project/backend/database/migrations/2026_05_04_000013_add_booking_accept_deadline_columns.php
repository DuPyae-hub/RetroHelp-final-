<?php

use App\Models\Booking;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('bookings') || Schema::hasColumn('bookings', 'accepted_at')) {
            return;
        }

        Schema::table('bookings', function (Blueprint $table) {
            $table->timestamp('accepted_at')->nullable()->after('patient_note');
            $table->timestamp('respond_by_at')->nullable()->after('accepted_at');
            $table->timestamp('cancelled_at')->nullable()->after('respond_by_at');
            $table->string('cancellation_reason', 64)->nullable()->after('cancelled_at');
        });

        $hours = (int) config('retrohelp.booking_respond_after_accept_hours', 48);

        Booking::query()
            ->where('status', Booking::STATUS_ACCEPTED)
            ->whereNull('respond_by_at')
            ->each(static function (Booking $booking) use ($hours): void {
                $base = $booking->updated_at ?? $booking->created_at ?? now();
                $booking->update([
                    'accepted_at' => $base,
                    'respond_by_at' => $base->copy()->addHours($hours),
                ]);
            });
    }

    public function down(): void
    {
        if (! Schema::hasTable('bookings')) {
            return;
        }

        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'cancellation_reason')) {
                $table->dropColumn('cancellation_reason');
            }
            if (Schema::hasColumn('bookings', 'cancelled_at')) {
                $table->dropColumn('cancelled_at');
            }
            if (Schema::hasColumn('bookings', 'respond_by_at')) {
                $table->dropColumn('respond_by_at');
            }
            if (Schema::hasColumn('bookings', 'accepted_at')) {
                $table->dropColumn('accepted_at');
            }
        });
    }
};
