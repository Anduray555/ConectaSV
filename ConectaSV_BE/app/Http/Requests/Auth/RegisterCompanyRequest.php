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

    public function messages(): array
    {
        return [
            'contact_number.digits' => 'El teléfono debe tener 8 dígitos.',
            'web_site.url' => 'Ingresa un sitio web válido.',
        ];
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        // "2290-1234" o "2290 1234" → "22901234"
        foreach (['contact_number', 'phone'] as $field) {
            if (is_string($this->input($field))) {
                $this->merge([$field => preg_replace('/\D/', '', $this->input($field))]);
            }
        }

        // "www.empresa.com.sv" → "https://www.empresa.com.sv"
        $web = is_string($this->web_site) ? trim($this->web_site) : $this->web_site;
        if (is_string($web) && $web !== '' && ! preg_match('#^https?://#i', $web)) {
            $web = 'https://'.$web;
        }
        $this->merge(['web_site' => $web === '' ? null : $web]);
    }
}
