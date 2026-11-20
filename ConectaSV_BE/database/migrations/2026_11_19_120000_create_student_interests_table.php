<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tipos de oferta que le interesan al estudiante (Trabajo, Práctica, Servicio Social).
        Schema::create('student_interests', function (Blueprint $table) {
            $table->foreignId('student_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('offer_type_id')->constrained()->restrictOnDelete();
            $table->primary(['student_profile_id', 'offer_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_interests');
    }
};
