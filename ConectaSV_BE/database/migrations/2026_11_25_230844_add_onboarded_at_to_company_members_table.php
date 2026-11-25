<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Igual que student_profiles.onboarded_at: null = mostrarle la pantalla de bienvenida
        // ("Invita a tu equipo" para el owner). Los reclutadores lo reciben ya marcado al
        // aceptar la invitación, porque esa pantalla no es para ellos.
        Schema::table('company_members', function (Blueprint $table) {
            $table->timestamp('onboarded_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('company_members', function (Blueprint $table) {
            $table->dropColumn('onboarded_at');
        });
    }
};
