<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('navigations')) {
            return;
        }

        Schema::create('navigations', function (Blueprint $table) {
            $table->id('navigation_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('start_location')->nullable();
            $table->string('destination')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('art_center_id')->nullable();

            $table->foreign('art_center_id')->references('id')->on('art_centers')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('navigations');
    }
};
