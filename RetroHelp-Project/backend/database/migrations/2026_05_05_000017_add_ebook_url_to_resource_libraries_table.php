<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('resource_libraries')) {
            return;
        }

        Schema::table('resource_libraries', function (Blueprint $table) {
            if (! Schema::hasColumn('resource_libraries', 'ebook_url')) {
                $table->string('ebook_url', 2048)->nullable()->after('content');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('resource_libraries')) {
            return;
        }

        Schema::table('resource_libraries', function (Blueprint $table) {
            if (Schema::hasColumn('resource_libraries', 'ebook_url')) {
                $table->dropColumn('ebook_url');
            }
        });
    }
};
