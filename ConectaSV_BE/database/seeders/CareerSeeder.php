<?php

namespace Database\Seeders;

use App\Models\Career;
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

        foreach ($catalog as $shortName => $careers) {
            $university = University::where('short_name', $shortName)->first();

            if (! $university) {
                continue;
            }

            foreach ($careers as $name) {
                Career::firstOrCreate([
                    'university_id' => $university->id,
                    'name' => $name,
                ]);
            }
        }
    }
}