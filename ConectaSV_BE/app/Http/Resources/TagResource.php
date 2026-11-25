<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Forma pública de un tag. Se usa en el catálogo, en /student/tags y en /auth/me. */
class TagResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            // Permite al frontend agrupar los tags de un estudiante por categoría.
            'category_id' => $this->tag_category_id,
        ];
    }
}
