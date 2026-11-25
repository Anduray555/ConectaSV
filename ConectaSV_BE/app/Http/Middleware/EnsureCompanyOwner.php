<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Deja pasar solo al owner de una empresa (no a los reclutadores).
 * Uso: ->middleware(['auth:sanctum', 'role:company', 'company.owner']).
 * Va después de role:company, que ya garantiza que el usuario es de una empresa.
 */
class EnsureCompanyOwner
{
    public function handle(Request $request, Closure $next): Response
    {
        $member = $request->user()?->companyMember;

        if (! $member?->isOwner()) {
            return response()->json(['message' => 'Solo el propietario de la empresa puede realizar esta acción.'], 403);
        }

        return $next($request);
    }
}
