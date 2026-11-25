<?php

namespace Database\Seeders;

use App\Models\StudyArea;
use App\Models\TagCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagCategorySeeder extends Seeder
{
    /** Lee el catálogo (categorías, áreas y tags) que usan este seeder y TagSeeder. */
    public static function catalog(): array
    {
        return require database_path('seeders/data/tag_catalog.php');
    }

    public function run(): void
    {
        // slug del área => id. Requiere que StudyAreaSeeder ya se haya ejecutado.
        $areaIds = StudyArea::pluck('id', 'slug');

        foreach (self::catalog()['categories'] as $data) {
            $category = TagCategory::updateOrCreate(
                ['slug' => Str::slug($data['name'])],
                ['name' => $data['name']],
            );

            // sync deja exactamente estas áreas en el pivote. Con [] la categoría queda sin
            // áreas, es decir, general. Los slugs que no existan se ignoran (filter).
            $category->studyAreas()->sync(
                collect($data['areas'])->map(fn (string $slug) => $areaIds->get($slug))->filter()->all()
            );
        }
    }
}
