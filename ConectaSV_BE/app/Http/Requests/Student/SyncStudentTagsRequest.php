<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

/** Cuerpo de PUT /api/student/tags: { "tag_ids": [1, 5, 9] }. */
class SyncStudentTagsRequest extends FormRequest
{
    /** Máximo de tags por estudiante. Público para que el controlador o los tests lo reutilicen. */
    public const MAX_TAGS = 10;

    public function authorize(): bool
    {
        return true; // El rol ya lo revisa el middleware role:student.
    }

    public function rules(): array
    {
        return [
            // "present" (y no "required"): debe venir la clave, pero se acepta [] para quitar todos.
            'tag_ids' => ['present', 'array', 'max:'.self::MAX_TAGS],
            'tag_ids.*' => ['integer', 'distinct', 'exists:tags,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'tag_ids.max' => 'Puedes elegir como máximo '.self::MAX_TAGS.' etiquetas.',
            'tag_ids.*.exists' => 'Una de las etiquetas seleccionadas no existe.',
            'tag_ids.*.distinct' => 'Hay etiquetas repetidas.',
        ];
    }

    public function attributes(): array
    {
        return ['tag_ids' => 'etiquetas'];
    }
}
