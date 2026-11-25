<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            CatalogSeeder::class,
            UniversitySeeder::class,
            StudyAreaSeeder::class, // antes de CareerSeeder y de las categorías: ambos se enlazan a áreas
            TagCategorySeeder::class,
            TagSeeder::class, // después de TagCategorySeeder: necesita las categorías
            AdminSeeder::class,
            CareerSeeder::class,
        ]);
    }
}
