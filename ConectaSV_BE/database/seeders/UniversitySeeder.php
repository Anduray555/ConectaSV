<?php

namespace Database\Seeders;

use App\Models\University;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UniversitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $universities = [
            ['Universidad de El Salvador', 'UES'],
            ['Universidad Centroamericana "José Simeón Cañas"', 'UCA'],
            ['Universidad Don Bosco', 'UDB'],
            ['Universidad Tecnológica de El Salvador', 'UTEC'],
            ['Universidad Francisco Gavidia', 'UFG'],
            ['Universidad Dr. José Matías Delgado', 'UJMD'],
            ['Universidad Evangélica de El Salvador', 'UEES'],
            ['Escuela Superior de Economía y Negocios', 'ESEN'],
        ];

        foreach($universities as [$name, $short_name]){
            University::firstOrCreate(
                ['name'=>$name],
                ['short_name'=>$short_name]
            );
        }
    }
}
