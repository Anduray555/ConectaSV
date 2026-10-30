<?php

namespace Database\Seeders;

use App\Models\TagCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Modalidad', 'Área', 'Tecnología'] as $name) {
            TagCategory::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name],
            );
        }
    }
}
