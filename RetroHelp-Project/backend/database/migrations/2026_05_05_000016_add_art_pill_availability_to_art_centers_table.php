<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('art_centers')) {
            return;
        }

        Schema::table('art_centers', function (Blueprint $table) {
            if (! Schema::hasColumn('art_centers', 'art_pills_available')) {
                $table->boolean('art_pills_available')->default(false)->after('is_verified');
            }
            if (! Schema::hasColumn('art_centers', 'art_pills_count')) {
                $table->unsignedInteger('art_pills_count')->default(0)->after('art_pills_available');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('art_centers')) {
            return;
        }

        Schema::table('art_centers', function (Blueprint $table) {
            if (Schema::hasColumn('art_centers', 'art_pills_count')) {
                $table->dropColumn('art_pills_count');
            }
            if (Schema::hasColumn('art_centers', 'art_pills_available')) {
                $table->dropColumn('art_pills_available');
            }
        });
    }
};
