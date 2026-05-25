<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users');
                $table->foreignId('clinic_id')->constrained('art_centers');
                $table->unsignedBigInteger('booking_id')->nullable();
                $table->unsignedTinyInteger('rating');
                $table->text('comment')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });

            if (in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
                DB::statement('ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5)');
            }

            Schema::table('reviews', function (Blueprint $table) {
                if (Schema::hasTable('bookings')) {
                    $table->foreign('booking_id')->references('id')->on('bookings')->nullOnDelete();
                    $table->unique('booking_id');
                }
            });

            return;
        }

        if (! Schema::hasColumn('reviews', 'booking_id') && Schema::hasTable('bookings')) {
            Schema::table('reviews', function (Blueprint $table) {
                $table->unsignedBigInteger('booking_id')->nullable()->after('clinic_id');
                $table->foreign('booking_id')->references('id')->on('bookings')->nullOnDelete();
                $table->unique('booking_id');
            });
        }
    }

    public function down(): void
    {
        // Keep table on rollback — data safety for production.
    }
};
