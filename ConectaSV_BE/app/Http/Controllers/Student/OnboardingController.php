<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * POST /api/student/onboarding — marca que el estudiante ya pasó por "Completa tu perfil"
 * (la terminó o la omitió). Los datos de cada paso se guardan con sus propios endpoints
 * (por ejemplo PUT /student/tags); este solo registra que la pantalla ya no debe mostrarse.
 */
class OnboardingController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $profile = $request->user()->studentProfile;
        abort_if($profile === null, 404, 'No se encontró tu perfil de estudiante.');

        // Idempotente: si ya estaba marcado, se conserva la primera fecha.
        if ($profile->onboarded_at === null) {
            $profile->update(['onboarded_at' => now()]);
        }

        return response()->json([
            'onboarded_at' => $profile->onboarded_at->toIso8601String(),
        ]);
    }
}
