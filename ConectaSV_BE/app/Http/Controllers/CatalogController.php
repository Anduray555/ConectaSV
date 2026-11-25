<?php

namespace App\Http\Controllers;

use App\Http\Resources\TagResource;
use App\Models\Career;
use App\Models\OfferType;
use App\Models\Sector;
use App\Models\TagCategory;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function universities(): JsonResponse
    {
        return response()->json(
            University::orderBy('name')->get(['id', 'name', 'short_name'])
        );
    }

    public function careers(University $university): JsonResponse
    {
        return response()->json(
            $university->careers()->orderBy('name')->get(['id', 'name'])
        );
    }

    public function sectors(): JsonResponse
    {
        return response()->json(
            Sector::orderBy('name')->get(['id', 'name'])
        );
    }

    public function offerTypes(): JsonResponse
    {
        return response()->json(
            OfferType::orderBy('id')->get(['id', 'name'])
        );
    }

    /**
     * GET /api/tags?career_id=5 — categorías con sus tags, listas para pintar un selector.
     *
     * Devuelve SIEMPRE todas las categorías (el estudiante puede elegir "ver todas"),
     * pero ordenadas y marcadas según la carrera:
     *   1. las del área de la carrera   (matches_career: true)
     *   2. las generales                (is_general: true; no tienen áreas)
     *   3. el resto
     * Sin career_id (por ejemplo, una empresa publicando una oferta) no hay paso 1.
     */
    public function tags(Request $request): JsonResponse
    {
        $request->validate(['career_id' => ['nullable', 'integer', 'exists:careers,id']]);

        $areaId = $request->filled('career_id')
            ? Career::find($request->integer('career_id'))->study_area_id
            : null;

        // with(...) carga tags y áreas en una consulta extra cada uno, no una por categoría.
        $categories = TagCategory::with([
            'tags' => fn ($q) => $q->orderBy('name'),
            'studyAreas:id',
        ])->orderBy('id')->get();

        $result = $categories
            ->map(function (TagCategory $category) use ($areaId) {
                $areaIds = $category->studyAreas->pluck('id');

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'is_general' => $areaIds->isEmpty(),
                    'matches_career' => $areaId !== null && $areaIds->contains($areaId),
                    'tags' => TagResource::collection($category->tags),
                ];
            })
            // Orden por grupo (0, 1, 2) y, dentro del grupo, por id (el orden del catálogo).
            ->sortBy([
                fn ($a, $b) => $this->tagGroup($a) <=> $this->tagGroup($b),
                fn ($a, $b) => $a['id'] <=> $b['id'],
            ])
            ->values();

        return response()->json($result);
    }

    private function tagGroup(array $category): int
    {
        return match (true) {
            $category['matches_career'] => 0,
            $category['is_general'] => 1,
            default => 2,
        };
    }
}
