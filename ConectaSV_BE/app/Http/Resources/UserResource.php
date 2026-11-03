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
            'student_profile' => $this->whenLoaded('studentProfile', fn () => [
                'student_code' => $this->studentProfile->student_code,
                'university' => $this->studentProfile->university->only(['id', 'name', 'short_name']),
                'career' => $this->studentProfile->career->only(['id', 'name']),
            ]),
            'company_member' => $this->whenLoaded('companyMember', fn () => [
                'phone' => $this->companyMember->phone,
                'role' => $this->companyMember->companyRole->name,
                'company' => [
                    'id' => $this->companyMember->company->id,
                    'name' => $this->companyMember->company->name,
                    'web_site' => $this->companyMember->company->web_site,
                    'contact_number' => $this->companyMember->company->contact_number,
                    'sector' => $this->companyMember->company->sector->name,
                ],
            ]),
        ];
    }
}