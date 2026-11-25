<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Fecha en que el estudiante terminó (u omitió) la pantalla "Completa tu perfil".
        // null = todavía no pasó por ella, así que el frontend se la debe mostrar.
        Schema::table('student_profiles', function (Blueprint $table) {
            // (Sin ->after(): PostgreSQL no permite elegir la posición; la columna va al final.)
            $table->timestamp('onboarded_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropColumn('onboarded_at');
        });
    }
};
