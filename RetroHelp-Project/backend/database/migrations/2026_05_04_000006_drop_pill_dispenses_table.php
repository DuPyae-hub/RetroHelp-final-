<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Legacy pill_dispenses flow removed; table dropped if present (e.g. after older migrations).
     */
    public function up(): void
    {
        Schema::dropIfExists('pill_dispenses');
    }

    public function down(): void
    {
        // Intentionally empty: legacy table is not recreated.
    }
};
