<?php

namespace Database\Seeders;

use App\Models\ApplicationState;
use App\Models\CompanyRole;
use App\Models\OfferStatus;
use App\Models\OfferType;
use App\Models\Sector;
use App\Models\SocialServiceDocumentSource;
use App\Models\SocialServiceDocumentType;
use App\Models\UserRole;
use Illuminate\Console\Application;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class CatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $catalogs=[
            [UserRole::class, ['student', 'company', 'admin']],
            [CompanyRole::class, ['owner', 'recruiter']],
            [OfferType::class, ['Trabajo', 'Práctica', 'Servicio Social']],
            [OfferStatus::class, ['Borrador', 'Publicada', 'Cerrada', 'Suspendida']],
            [ApplicationState::class, [
                'Pendiente', 'En revisión', 'Entrevista',
                'Seleccionado', 'Rechazado', 'Retirado'
            ]],
            [Sector::class, [
                'Tecnología', 'Salud', 'Educación', 'Comercio',
                'Industria', 'Finanzas', 'Servicios profesionales', 'Gobierno y ONG'
            ]],
            [SocialServiceDocumentType::class, [
                'Carta de Solicitud', 'Perfil del Proyecto', 'Plan del Proyecto'
            ]],
            [SocialServiceDocumentSource::class, ['Generado', 'Subido']],
        ];

        foreach($catalogs as [$model, $names]){
            foreach ($names as $name){
                $model::firstOrCreate(['name'=>$name]);
            }
        }
    }
}
