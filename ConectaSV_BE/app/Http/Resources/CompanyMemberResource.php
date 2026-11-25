<?php

namespace App\Http\Resources;

use App\Models\CompanyMember;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Un miembro de la empresa tal como lo ve el owner en "Reclutadores".
 * El `id` es el de company_members (no el del usuario): es el que usan las rutas.
 *
 * @mixin CompanyMember
 */
class CompanyMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->user;

        return [
            'id' => $this->id,
            'full_name' => collect([$user->first_name, $user->second_name, $user->first_surname, $user->second_surname])
                ->filter()
                ->implode(' '),
            'email' => $user->email,
            'phone' => $this->phone,
            'avatar_url' => $user->avatarUrl(),
            'role' => $this->companyRole->name,
            'is_owner' => $this->isOwner(),
            'is_active' => $user->is_active,
            'joined_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
