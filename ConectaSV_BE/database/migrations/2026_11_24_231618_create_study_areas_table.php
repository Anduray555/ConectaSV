<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Áreas de estudio (Tecnología, Salud, Derecho...). Agrupan carreras parecidas de
        // distintas universidades, y sirven para saber qué categorías de tags le aplican a
        // cada estudiante sin tener que enlazar cada carrera por separado.
        Schema::create('study_areas', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('study_areas');
    }
};
