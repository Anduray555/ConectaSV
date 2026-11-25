<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pivote estudiante <-> tag. Nombre en singular y orden alfabético (convención de Laravel),
        // igual que student_interests.
        Schema::create('student_profile_tag', function (Blueprint $table) {
            // Si se borra el perfil, se borran sus tags asociados.
            $table->foreignId('student_profile_id')->constrained()->cascadeOnDelete();
            // Un tag en uso no se puede borrar (protege perfiles y, luego, la compatibilidad).
            $table->foreignId('tag_id')->constrained()->restrictOnDelete();

            // PK compuesta: un estudiante no puede tener el mismo tag dos veces.
            $table->primary(['student_profile_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_profile_tag');
    }
};
