<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreInvitationRequest;
use App\Http\Resources\InvitationResource;
use App\Mail\CompanyInvitationMail;
use App\Models\CompanyInvitation;
use App\Models\CompanyRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Invitaciones de la empresa del owner autenticado.
 * Rutas con auth:sanctum + role:company + company.owner.
 */
class InvitationController extends Controller
{
    /** Máximo de invitaciones pendientes a la vez (evita abusos, por ejemplo spam de correos). */
    public const MAX_PENDING = 20;

    /** GET /api/company/invitations — las que aún no se aceptaron (pendientes y vencidas). */
    public function index(Request $request): AnonymousResourceCollection
    {
        $invitations = $request->user()->companyMember->company->invitations()
            ->whereNull('accepted_at')
            ->with(['companyRole', 'inviter.user'])
            ->latest()
            ->get();

        return InvitationResource::collection($invitations);
    }

    /**
     * POST /api/company/invitations — crea una invitación de reclutador.
     * Devuelve el link completo SOLO aquí: después el servidor ya no lo conoce (guarda el hash).
     */
    public function store(StoreInvitationRequest $request): JsonResponse
    {
        $member = $request->user()->companyMember;
        $company = $member->company;

        if ($company->invitations()->pending()->count() >= self::MAX_PENDING) {
            return response()->json([
                'message' => 'Tienes demasiadas invitaciones pendientes. Revoca alguna antes de crear otra.',
            ], 422);
        }

        [$plainToken, $hash] = CompanyInvitation::newToken();

        $invitation = $company->invitations()->create([
            'invited_by' => $member->id,
            'email' => $request->validated('email'),
            'token' => $hash,
            'company_role_id' => CompanyRole::where('name', CompanyRole::RECRUITER)->firstOrFail()->id,
            'expires_at' => now()->addHours(CompanyInvitation::TTL_HOURS),
        ]);

        $link = CompanyInvitation::linkFor($plainToken);
        $emailSent = false;

        if ($invitation->email) {
            try {
                Mail::to($invitation->email)->send(new CompanyInvitationMail($invitation, $link));
                $emailSent = true;
            } catch (Throwable $e) {
                // Si el servidor de correo falla, la invitación igual sirve: el owner puede
                // copiar el link. Se registra el error en el log para revisarlo.
                report($e);
            }
        }

        return response()->json([
            'invitation' => new InvitationResource($invitation->load(['companyRole', 'inviter.user'])),
            'link' => $link,
            'email_sent' => $emailSent,
        ], 201);
    }

    /** DELETE /api/company/invitations/{invitation} — revoca (borra) una invitación no aceptada. */
    public function destroy(Request $request, CompanyInvitation $invitation): JsonResponse
    {
        // Una invitación de OTRA empresa se trata como inexistente (404, no 403):
        // así no se revela que ese id existe.
        abort_if($invitation->company_id !== $request->user()->companyMember->company_id, 404);

        if ($invitation->isAccepted()) {
            return response()->json(['message' => 'Esta invitación ya fue aceptada.'], 422);
        }

        $invitation->delete();

        return response()->json(['message' => 'Invitación revocada.']);
    }
}
