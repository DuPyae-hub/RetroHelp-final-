<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('art_centers')) {
            return;
        }

        Schema::create('art_centers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('contact_no')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
            $table->string('township')->nullable();
            $table->string('area')->nullable();
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->integer('total_reviews')->default(0);

            $table->index('township');
            $table->index('area');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('art_centers');
    }
};
