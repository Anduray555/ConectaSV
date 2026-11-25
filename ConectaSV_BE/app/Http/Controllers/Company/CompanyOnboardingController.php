<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * POST /api/company/onboarding — el owner terminó (u omitió) "Invita a tu equipo".
 * Mismo patrón que Student\OnboardingController: idempotente, conserva la primera fecha.
 */
class CompanyOnboardingController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $member = $request->user()->companyMember;

        if ($member->onboarded_at === null) {
            $member->update(['onboarded_at' => now()]);
        }

        return response()->json(['onboarded_at' => $member->onboarded_at->toIso8601String()]);
    }
}
