<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('reviews') || Schema::hasColumn('reviews', 'booking_id')) {
            return;
        }

        Schema::table('reviews', function (Blueprint $table) {
            $table->unsignedBigInteger('booking_id')->nullable()->after('clinic_id');
            $table->foreign('booking_id')->references('id')->on('bookings')->nullOnDelete();
            $table->unique('booking_id');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('reviews') || ! Schema::hasColumn('reviews', 'booking_id')) {
            return;
        }

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['booking_id']);
            $table->dropUnique(['booking_id']);
            $table->dropColumn('booking_id');
        });
    }
};
