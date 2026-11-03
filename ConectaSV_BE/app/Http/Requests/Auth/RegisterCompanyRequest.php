<?php

namespace App\Http\Requests\Auth;

class RegisterCompanyRequest extends AuthRequest
{
    public function rules(): array
    {
        return array_merge($this->userRules(), [
            'company_name' => ['required', 'string', 'max:255'],
            'sector_id' => ['required', 'integer', 'exists:sectors,id'],
            'web_site' => ['nullable', 'url', 'max:255'],
            'contact_number' => ['required', 'digits:8'],
            'phone' => ['nullable', 'digits:8'],
        ]);
    }
}