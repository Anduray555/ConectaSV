<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

abstract class AuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->email)) {
            $this->merge(['email' => mb_strtolower(trim($this->email))]);
        }
    }

    /** Nombres legibles de los campos para los mensajes de validación. */
    public function attributes(): array
    {
        return [
            'first_name' => 'nombre',
            'second_name' => 'segundo nombre',
            'first_surname' => 'apellido',
            'second_surname' => 'segundo apellido',
            'email' => 'correo electrónico',
            'password' => 'contraseña',
            'university_id' => 'universidad',
            'career_id' => 'carrera',
            'student_code' => 'carné',
            'interests' => 'intereses',
            'company_name' => 'nombre de la empresa',
            'sector_id' => 'sector',
            'web_site' => 'sitio web',
            'contact_number' => 'teléfono de contacto',
            'phone' => 'teléfono',
        ];
    }

    protected function userRules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'second_name' => ['nullable', 'string', 'max:100'],
            'first_surname' => ['required', 'string', 'max:100'],
            'second_surname' => ['nullable', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
}