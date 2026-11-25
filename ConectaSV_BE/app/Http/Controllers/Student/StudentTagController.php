<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\SyncStudentTagsRequest;
use App\Http\Resources\TagResource;
use App\Models\StudentProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** Tags del estudiante autenticado. Rutas con auth:sanctum + role:student. */
class StudentTagController extends Controller
{
    /** GET /api/student/tags */
    public function index(Request $request): AnonymousResourceCollection
    {
        return TagResource::collection($this->profile($request)->tags()->orderBy('name')->get());
    }

    /** PUT /api/student/tags — reemplaza la lista completa. */
    public function update(SyncStudentTagsRequest $request): AnonymousResourceCollection
    {
        $profile = $this->profile($request);

        // sync() deja en el pivote exactamente estos ids: agrega los nuevos y quita los que
        // ya no vienen, en una sola operación. Por eso el frontend siempre manda la lista entera.
        $profile->tags()->sync($request->validated('tag_ids'));

        return TagResource::collection($profile->tags()->orderBy('name')->get());
    }

    private function profile(Request $request): StudentProfile
    {
        // Todo usuario student tiene perfil (se crea en el registro); si no, es un error de datos.
        $profile = $request->user()->studentProfile;
        abort_if($profile === null, 404, 'No se encontró tu perfil de estudiante.');

        return $profile;
    }
}
