<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Cuerpo de POST /api/company/invitations: { "email": "..." } o {} para un link sin correo. */
class StoreInvitationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Lo decide el middleware company.owner.
    }

    protected function prepareForValidation(): void
    {
        $email = is_string($this->email) ? mb_strtolower(trim($this->email)) : $this->email;
        $this->merge(['email' => $email === '' ? null : $email]);
    }

    public function rules(): array
    {
        $companyId = $this->user()->companyMember->company_id;

        return [
            'email' => [
                'nullable',
                'email',
                'max:255',
                // Un usuario pertenece a UNA sola cuenta: si el correo ya está registrado,
                // esa persona no puede crear otra cuenta con él.
                Rule::unique('users', 'email'),
                // No dos invitaciones pendientes para el mismo correo en la misma empresa.
                Rule::unique('company_invitations', 'email')->where(fn ($q) => $q
                    ->where('company_id', $companyId)
                    ->whereNull('accepted_at')
                    ->where('expires_at', '>', now())),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Ingresa un correo válido.',
            'email.unique' => 'Ese correo ya tiene una cuenta o una invitación pendiente.',
        ];
    }

    public function attributes(): array
    {
        return ['email' => 'correo electrónico'];
    }
}
