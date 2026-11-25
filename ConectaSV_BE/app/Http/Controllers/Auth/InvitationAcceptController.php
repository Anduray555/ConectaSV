<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AcceptInvitationRequest;
use App\Models\CompanyInvitation;
use App\Models\User;
use App\Models\UserRole;
use App\Support\AuthSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Rutas PÚBLICAS de una invitación (quien la abre todavía no tiene cuenta).
 * El {token} de la URL es el token en texto plano del link; se busca por su hash.
 */
class InvitationAcceptController extends Controller
{
    /** GET /api/invitations/{token} — datos para la pantalla "Te invitaron a…". */
    public function show(string $token): JsonResponse
    {
        $invitation = $this->findUsable($token);
        $invitation->load(['company.sector', 'companyRole', 'inviter.user']);

        return response()->json([
            'company' => [
                'name' => $invitation->company->name,
                'sector' => $invitation->company->sector->name,
                'logo_url' => $invitation->company->logoUrl(),
            ],
            // Si viene, el frontend lo muestra fijo en el formulario.
            'email' => $invitation->email,
            'role' => $invitation->companyRole->name,
            'invited_by' => $invitation->inviter?->user?->only(['first_name', 'first_surname']),
            'expires_at' => $invitation->expires_at->toIso8601String(),
        ]);
    }

    /** POST /api/invitations/{token}/accept — crea la cuenta del reclutador e inicia sesión. */
    public function accept(AcceptInvitationRequest $request, string $token): JsonResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($token, $data) {
            // lockForUpdate bloquea la fila hasta terminar la transacción: si dos personas
            // envían el mismo link al mismo tiempo, la segunda espera y luego ve accepted_at
            // ya marcado. Así una invitación nunca crea dos cuentas.
            $invitation = CompanyInvitation::where('token', CompanyInvitation::hashToken($token))
                ->lockForUpdate()
                ->first();

            $this->ensureUsable($invitation);

            if ($invitation->email && $invitation->email !== $data['email']) {
                throw ValidationException::withMessages([
                    'email' => ['Esta invitación es para otro correo electrónico.'],
                ]);
            }

            $user = User::createWithRole($data, UserRole::COMPANY);

            $invitation->company->members()->create([
                'user_id' => $user->id,
                'company_role_id' => $invitation->company_role_id,
                'phone' => $data['phone'] ?? null,
                // La pantalla "Invita a tu equipo" es solo para el owner.
                'onboarded_at' => now(),
            ]);

            $invitation->update(['accepted_at' => now()]);

            return $user;
        });

        return AuthSession::respond($user, 201);
    }

    private function findUsable(string $token): CompanyInvitation
    {
        $invitation = CompanyInvitation::findByToken($token);
        $this->ensureUsable($invitation);

        return $invitation;
    }

    /**
     * 404 si no existe; 410 (Gone = "existió pero ya no está disponible") si ya se usó o venció.
     * abort() corta la ejecución y Laravel responde el JSON { message }.
     */
    private function ensureUsable(?CompanyInvitation $invitation): void
    {
        abort_if($invitation === null, 404, 'Esta invitación no existe o fue revocada.');
        abort_if($invitation->isAccepted(), 410, 'Esta invitación ya fue utilizada.');
        abort_if($invitation->isExpired(), 410, 'Esta invitación venció. Pide a la empresa que te envíe una nueva.');
    }
}
