<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Logo de la empresa: igual que users.avatar_path, solo la ruta en el disco "public".
        Schema::table('companies', function (Blueprint $table) {
            $table->string('logo_path')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('logo_path');
        });
    }
};
