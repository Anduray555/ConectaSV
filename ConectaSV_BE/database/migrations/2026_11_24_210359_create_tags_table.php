<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Lista cerrada de etiquetas (las gestionará el admin). Se usan en perfiles de
        // estudiante y en ofertas, para filtrar y para calcular la compatibilidad.
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            // restrictOnDelete: no se puede borrar una categoría que todavía tiene tags.
            $table->foreignId('tag_category_id')->constrained()->restrictOnDelete();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
