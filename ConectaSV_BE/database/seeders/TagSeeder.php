<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\TagCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    /**
     * Crea los tags del catálogo (database/seeders/data/tag_catalog.php).
     * Debe ir después de TagCategorySeeder, que crea las categorías.
     */
    public function run(): void
    {
        $catalog = TagCategorySeeder::catalog();
        $categoryIds = TagCategory::pluck('id', 'slug');

        foreach ($catalog['categories'] as $data) {
            $categoryId = $categoryIds->get(Str::slug($data['name']));

            foreach ($data['tags'] as $name) {
                // Algunos nombres necesitan un slug escrito a mano ("C#" -> "csharp").
                $slug = $catalog['slugs'][$name] ?? Str::slug($name);

                // Idempotente: busca por slug; si ya existe, actualiza nombre y categoría.
                Tag::updateOrCreate(
                    ['slug' => $slug],
                    ['name' => $name, 'tag_category_id' => $categoryId],
                );
            }
        }
    }
}
