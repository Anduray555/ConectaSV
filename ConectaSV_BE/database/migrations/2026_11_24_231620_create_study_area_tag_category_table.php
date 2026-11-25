<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pivote área <-> categoría de tags (N:M): "Contabilidad" puede servir a Negocios y a
        // Ingeniería, y Tecnología tiene muchas categorías (Frontend, Backend...).
        // Una categoría SIN filas aquí se considera general: la ven todas las carreras.
        Schema::create('study_area_tag_category', function (Blueprint $table) {
            $table->foreignId('study_area_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_category_id')->constrained()->cascadeOnDelete();
            $table->primary(['study_area_id', 'tag_category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('study_area_tag_category');
    }
};
