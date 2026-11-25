<?php

namespace App\Http\Resources;

use App\Models\CompanyInvitation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Invitación vista por el owner (listado). Nunca incluye el token: el link completo solo
 * se devuelve una vez, al crearla (ver InvitationController::store).
 *
 * @mixin CompanyInvitation
 */
class InvitationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'role' => $this->companyRole->name,
            'status' => $this->status(),
            'expires_at' => $this->expires_at->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'invited_by' => $this->inviter?->user?->only(['first_name', 'first_surname']),
        ];
    }
}
