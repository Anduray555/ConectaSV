<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Un usuario tal como lo ve el panel de administración.
 * `detail` resume su perfil: universidad y carrera, o nombre de la empresa.
 */
class AdminUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => collect([$this->first_name, $this->second_name, $this->first_surname, $this->second_surname])
                ->filter()
                ->implode(' '),
            'email' => $this->email,
            'role' => $this->role->name,
            'is_active' => $this->is_active,
            'detail' => $this->detail(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    private function detail(): ?string
    {
        if ($this->relationLoaded('studentProfile') && $this->studentProfile) {
            $profile = $this->studentProfile;

            return collect([$profile->university?->short_name ?? $profile->university?->name, $profile->career?->name])
                ->filter()
                ->implode(' · ');
        }

        if ($this->relationLoaded('companyMember') && $this->companyMember) {
            return $this->companyMember->company?->name;
        }

        return null;
    }
}
