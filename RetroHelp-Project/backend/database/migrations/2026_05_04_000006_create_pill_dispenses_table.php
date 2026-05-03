<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pill_dispenses', function (Blueprint $table) {
            $table->id('dispense_id');
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('staff_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['Pending', 'Received', 'Given'])->default('Pending');
            $table->dateTime('dispense_date')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('art_center_id')->nullable();
            $table->unsignedBigInteger('navigation_id')->nullable();

            $table->foreign('art_center_id')->references('id')->on('art_centers')->onDelete('set null');
            $table->foreign('navigation_id')->references('navigation_id')->on('navigations')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pill_dispenses');
    }
};
