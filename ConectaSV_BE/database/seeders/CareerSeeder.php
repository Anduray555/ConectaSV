<?php

namespace Database\Seeders;

use App\Models\Career;
use App\Models\StudyArea;
use App\Models\University;
use Illuminate\Database\Seeder;

class CareerSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            'UES' => [
                'Ingeniería de Sistemas Informáticos',
                'Ingeniería Industrial',
                'Ingeniería Eléctrica',
                'Ingeniería Civil',
                'Licenciatura en Administración de Empresas',
                'Licenciatura en Contaduría Pública',
                'Licenciatura en Ciencias Jurídicas',
                'Licenciatura en Psicología',
                'Doctorado en Medicina',
            ],
            'UCA' => [
                'Ingeniería Informática',
                'Ingeniería Industrial',
                'Ingeniería Civil',
                'Ingeniería Eléctrica',
                'Ingeniería Mecánica',
                'Ingeniería Química',
                'Arquitectura',
                'Licenciatura en Administración de Empresas',
            ],
            'UDB' => [
                'Ingeniería en Ciencias de la Computación',
                'Ingeniería Eléctrica',
                'Ingeniería Industrial',
                'Ingeniería Mecánica',
                'Ingeniería Biomédica',
                'Ingeniería en Telecomunicaciones',
                'Ingeniería Mecatrónica',
                'Ingeniería Electrónica',
                'Ingeniería en Automatización',
                'Ingeniería en Aeronáutica',
            ],
            'UTEC' => [
                'Ingeniería en Sistemas y Computación',
                'Ingeniería Industrial',
                'Arquitectura',
                'Licenciatura en Administración de Empresas',
                'Licenciatura en Mercadeo',
                'Licenciatura en Diseño Gráfico',
                'Licenciatura en Ciencias Jurídicas',
                'Licenciatura en Psicología',
            ],
            'UFG' => [
                'Arquitectura',
                'Ingeniería en Inteligencia Artificial y Robótica',
                'Ingeniería en Diseño y Desarrollo de Videojuegos',
                'Licenciatura en Ciencias Jurídicas',
                'Licenciatura en Comercio Internacional',
            ],
            'UJMD' => [
                'Arquitectura',
                'Ingeniería Agroindustrial',
                'Ingeniería en Alimentos',
                'Licenciatura en Administración de Empresas',
                'Licenciatura en Ciencias Jurídicas',
                'Licenciatura en Ciencias de la Comunicación',
                'Doctorado en Medicina',
            ],
            'UEES' => [
                // Pendiente: solo se confirmaron estas dos.
                'Ingeniería en Desarrollo de Software y Ciencia de Datos',
                'Doctorado en Medicina',
            ],
            'ESEN' => [
                'Licenciatura en Economía y Negocios',
                'Licenciatura en Ciencias Jurídicas',
                'Ingeniería de Negocios',
                'Ingeniería de Software y Negocios Digitales',
            ],
        ];

        // slug del área => id, para no consultar la base de datos por cada carrera.
        $areaIds = StudyArea::pluck('id', 'slug');

        foreach ($catalog as $shortName => $careers) {
            $university = University::where('short_name', $shortName)->first();

            if (! $university) {
                continue;
            }

            foreach ($careers as $name) {
                $areaSlug = self::AREA_BY_CAREER[$name] ?? null;

                if ($areaSlug === null) {
                    // Aviso en consola: la carrera se crea igual, pero sin área.
                    $this->command?->warn("Carrera sin área asignada: {$name}");
                }

                // updateOrCreate (y no firstOrCreate): así las carreras que ya existían
                // también reciben su área al volver a correr el seeder.
                Career::updateOrCreate(
                    ['university_id' => $university->id, 'name' => $name],
                    // get() devuelve null si StudyAreaSeeder no se ejecutó (por ejemplo, en un test).
                    ['study_area_id' => $areaIds->get($areaSlug)],
                );
            }
        }
    }

    /**
     * Área de cada carrera, por nombre. Se define por nombre (no por universidad) porque la
     * misma carrera en varias universidades pertenece a la misma área.
     * Los valores son slugs de StudyAreaSeeder::AREAS.
     */
    private const AREA_BY_CAREER = [
        // Tecnología
        'Ingeniería de Sistemas Informáticos' => 'tecnologia',
        'Ingeniería Informática' => 'tecnologia',
        'Ingeniería en Ciencias de la Computación' => 'tecnologia',
        'Ingeniería en Sistemas y Computación' => 'tecnologia',
        'Ingeniería en Inteligencia Artificial y Robótica' => 'tecnologia',
        'Ingeniería en Diseño y Desarrollo de Videojuegos' => 'tecnologia',
        'Ingeniería en Desarrollo de Software y Ciencia de Datos' => 'tecnologia',
        'Ingeniería de Software y Negocios Digitales' => 'tecnologia',

        // Ingeniería
        'Ingeniería Industrial' => 'ingenieria',
        'Ingeniería Eléctrica' => 'ingenieria',
        'Ingeniería Civil' => 'ingenieria',
        'Ingeniería Mecánica' => 'ingenieria',
        'Ingeniería Química' => 'ingenieria',
        'Ingeniería Biomédica' => 'ingenieria',
        'Ingeniería en Telecomunicaciones' => 'ingenieria',
        'Ingeniería Mecatrónica' => 'ingenieria',
        'Ingeniería Electrónica' => 'ingenieria',
        'Ingeniería en Automatización' => 'ingenieria',
        'Ingeniería en Aeronáutica' => 'ingenieria',
        'Ingeniería Agroindustrial' => 'ingenieria',
        'Ingeniería en Alimentos' => 'ingenieria',

        // Salud
        'Doctorado en Medicina' => 'salud',

        // Negocios
        'Licenciatura en Administración de Empresas' => 'negocios',
        'Licenciatura en Contaduría Pública' => 'negocios',
        'Licenciatura en Mercadeo' => 'negocios',
        'Licenciatura en Comercio Internacional' => 'negocios',
        'Licenciatura en Economía y Negocios' => 'negocios',
        'Ingeniería de Negocios' => 'negocios',

        // Derecho
        'Licenciatura en Ciencias Jurídicas' => 'derecho',

        // Arquitectura y diseño
        'Arquitectura' => 'arquitectura-y-diseno',
        'Licenciatura en Diseño Gráfico' => 'arquitectura-y-diseno',

        // Ciencias sociales y humanidades
        'Licenciatura en Psicología' => 'ciencias-sociales-y-humanidades',
        'Licenciatura en Ciencias de la Comunicación' => 'ciencias-sociales-y-humanidades',
    ];
}