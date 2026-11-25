<?php

namespace Database\Seeders;

use App\Models\StudyArea;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StudyAreaSeeder extends Seeder
{
    /** Áreas de estudio. CareerSeeder asigna cada carrera a una de ellas por su slug. */
    public const AREAS = [
        'Tecnología',
        'Ingeniería',
        'Salud',
        'Negocios',
        'Derecho',
        'Arquitectura y diseño',
        'Ciencias sociales y humanidades',
    ];

    public function run(): void
    {
        foreach (self::AREAS as $name) {
            StudyArea::updateOrCreate(['slug' => Str::slug($name)], ['name' => $name]);
        }
    }
}
