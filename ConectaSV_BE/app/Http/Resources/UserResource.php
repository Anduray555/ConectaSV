<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'second_name' => $this->second_name,
            'first_surname' => $this->first_surname,
            'second_surname' => $this->second_surname,
            'email' => $this->email,
            'role' => $this->role->name,
            'is_active' => $this->is_active,
            // null = sin foto (el frontend muestra las iniciales).
            'avatar_url' => $this->avatarUrl(),
            'student_profile' => $this->whenLoaded('studentProfile', fn () => [
                'student_code' => $this->studentProfile->student_code,
                'university' => $this->studentProfile->university->only(['id', 'name', 'short_name']),
                'career' => $this->studentProfile->career->only(['id', 'name']),
                'interests' => $this->studentProfile->interests->map->only(['id', 'name'])->values(),
                'tags' => TagResource::collection($this->studentProfile->tags),
                // null = aún no pasa por "Completa tu perfil"; el frontend la muestra.
                'onboarded_at' => $this->studentProfile->onboarded_at?->toIso8601String(),
            ]),
            'company_member' => $this->whenLoaded('companyMember', fn () => [
                'phone' => $this->companyMember->phone,
                'role' => $this->companyMember->companyRole->name,
                // Atajo para el frontend: muestra u oculta lo que solo puede hacer el owner.
                'is_owner' => $this->companyMember->isOwner(),
                // null = el owner aún no pasa por "Invita a tu equipo".
                'onboarded_at' => $this->companyMember->onboarded_at?->toIso8601String(),
                'company' => [
                    'id' => $this->companyMember->company->id,
                    'name' => $this->companyMember->company->name,
                    'logo_url' => $this->companyMember->company->logoUrl(),
                    'web_site' => $this->companyMember->company->web_site,
                    'contact_number' => $this->companyMember->company->contact_number,
                    'sector' => $this->companyMember->company->sector->name,
                ],
            ]),
        ];
    }
}