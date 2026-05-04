<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Repairs MySQL installs where migration 013 was skipped (e.g. accepted_at existed
     * without respond_by_at), so expiry queries do not fail.
     */
    public function up(): void
    {
        if (! Schema::hasTable('bookings')) {
            return;
        }

        if (! Schema::hasColumn('bookings', 'accepted_at')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->timestamp('accepted_at')->nullable();
            });
        }

        if (! Schema::hasColumn('bookings', 'respond_by_at')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->timestamp('respond_by_at')->nullable();
            });
        }

        if (! Schema::hasColumn('bookings', 'cancelled_at')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->timestamp('cancelled_at')->nullable();
            });
        }

        if (! Schema::hasColumn('bookings', 'cancellation_reason')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->string('cancellation_reason', 64)->nullable();
            });
        }
    }

    public function down(): void
    {
        //
    }
};
