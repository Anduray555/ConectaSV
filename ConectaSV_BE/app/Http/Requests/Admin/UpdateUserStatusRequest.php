<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/** Cuerpo de PATCH /api/admin/users/{user}/status. */
class UpdateUserStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // El rol ya lo revisa el middleware role:admin.
    }

    public function rules(): array
    {
        return [
            'is_active' => ['required', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return ['is_active' => 'estado'];
    }
}
