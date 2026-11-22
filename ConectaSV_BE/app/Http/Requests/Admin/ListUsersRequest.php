<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/** Filtros de GET /api/admin/users. Todos son opcionales. */
class ListUsersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // El rol ya lo revisa el middleware role:admin.
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', 'in:student,company'],
            'status' => ['nullable', 'in:active,suspended'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function attributes(): array
    {
        return [
            'search' => 'búsqueda',
            'role' => 'tipo de usuario',
            'status' => 'estado',
            'per_page' => 'resultados por página',
        ];
    }
}
