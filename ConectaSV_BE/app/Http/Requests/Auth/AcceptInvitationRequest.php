<?php

namespace App\Http\Requests\Auth;

/**
 * Cuerpo de POST /api/invitations/{token}/accept: los datos de la cuenta del reclutador.
 * Hereda de AuthRequest: mismas reglas de nombre, correo y contraseña que el registro.
 * Que el correo coincida con el de la invitación se revisa en el controlador.
 */
class AcceptInvitationRequest extends AuthRequest
{
    public function rules(): array
    {
        return array_merge($this->userRules(), [
            'phone' => ['nullable', 'digits:8'],
        ]);
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Ya existe una cuenta con este correo.',
            'phone.digits' => 'El teléfono debe tener 8 dígitos.',
        ];
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        // "7777-8888" → "77778888"
        if (is_string($this->phone)) {
            $phone = preg_replace('/\D/', '', $this->phone);
            $this->merge(['phone' => $phone === '' ? null : $phone]);
        }
    }
}
