<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Invitaciones para unirse a una empresa. Una invitación = una persona:
        // al aceptarse se marca accepted_at y ya no sirve.
        Schema::create('company_invitations', function (Blueprint $table) {
            $table->id();
            // Si se borra la empresa, sus invitaciones ya no tienen sentido.
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            // Quién invitó. nullable + nullOnDelete: si ese miembro se borra, la invitación
            // sigue existiendo (solo pierde el dato de quién la creó).
            $table->foreignId('invited_by')->nullable()->constrained('company_members')->nullOnDelete();
            // Opcional: con email, solo esa dirección puede aceptarla (y se le envía el correo);
            // sin email, la usa la primera persona que abra el link.
            $table->string('email')->nullable();
            // Hash SHA-256 del token (64 caracteres hex), NUNCA el token en texto plano.
            $table->string('token', 64)->unique();
            $table->foreignId('company_role_id')->constrained()->restrictOnDelete();
            $table->timestamp('expires_at');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();

            // Para buscar rápido "invitaciones pendientes de esta empresa para este correo".
            $table->index(['company_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_invitations');
    }
};
