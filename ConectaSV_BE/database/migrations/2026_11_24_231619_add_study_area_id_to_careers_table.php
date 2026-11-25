<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Cada carrera pertenece a UNA área (relación 1:N).
        Schema::table('careers', function (Blueprint $table) {
            // nullable: las carreras que ya existen no tienen área hasta que corre el seeder,
            // y una carrera nueva sin área simplemente verá solo las categorías generales.
            // nullOnDelete: si se borra un área, sus carreras quedan sin área (no se borran).
            $table->foreignId('study_area_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            // Primero la llave foránea, luego la columna.
            $table->dropConstrainedForeignId('study_area_id');
        });
    }
};
