<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyMemberResource;
use App\Models\CompanyMember;
use App\Models\CompanyRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Miembros de la empresa del owner autenticado.
 * Rutas con auth:sanctum + role:company + company.owner.
 */
class MemberController extends Controller
{
    /** GET /api/company/members — el owner primero, luego los reclutadores por antigüedad. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $members = $request->user()->companyMember->company->members()
            ->with(['user', 'companyRole'])
            // El owner arriba: ordena por "¿es owner?" (los true primero) y luego por fecha.
            ->orderByRaw('company_role_id = ? desc', [CompanyRole::where('name', CompanyRole::OWNER)->value('id')])
            ->orderBy('created_at')
            ->get();

        return CompanyMemberResource::collection($members);
    }

    /**
     * PATCH /api/company/members/{member}/status — { "is_active": false|true }.
     * Quitar a un reclutador = desactivar su cuenta (se conserva todo lo que hizo).
     */
    public function updateStatus(Request $request, CompanyMember $member): CompanyMemberResource|JsonResponse
    {
        $data = $request->validate(['is_active' => ['required', 'boolean']], [], ['is_active' => 'estado']);

        // Un miembro de OTRA empresa se trata como inexistente (404): no se revela que existe.
        abort_if($member->company_id !== $request->user()->companyMember->company_id, 404);

        if ($member->isOwner()) {
            return response()->json(['message' => 'La cuenta del propietario no se puede desactivar desde aquí.'], 422);
        }

        $user = $member->user;
        $user->update(['is_active' => $data['is_active']]);

        // Al desactivar se cierran todas sus sesiones: el login ya rechaza cuentas inactivas,
        // pero un token emitido antes seguiría funcionando si no se borra.
        if (! $user->is_active) {
            $user->tokens()->delete();
        }

        return new CompanyMemberResource($member->load(['user', 'companyRole']));
    }
}
