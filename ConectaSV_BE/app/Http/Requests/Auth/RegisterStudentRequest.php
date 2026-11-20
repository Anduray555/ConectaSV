<?php

namespace App\Http\Requests\Auth;

use Illuminate\Validation\Rule;

class RegisterStudentRequest extends AuthRequest
{
    public function rules(): array
    {
        return array_merge($this->userRules(), [
            'university_id' => ['required', 'integer', 'exists:universities,id'],
            'career_id' => [
                'required',
                'integer',
                Rule::exists('careers', 'id')->where('university_id', $this->input('university_id')),
            ],
            'student_code' => [
                'required',
                'string',
                'max:10',
                Rule::unique('student_profiles', 'student_code')
                    ->where('university_id', $this->input('university_id')),
            ],
            'interests' => ['required', 'array', 'min:1'],
            'interests.*' => ['integer', 'distinct', 'exists:offer_types,id'],
        ]);
    }

    public function messages(): array
    {
        return [
            'interests.required' => 'Selecciona al menos un tipo de oportunidad.',
            'interests.min' => 'Selecciona al menos un tipo de oportunidad.',
            'student_code.unique' => 'Este carné ya está registrado en tu universidad.',
        ];
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        if (is_string($this->student_code)) {
            $this->merge(['student_code' => mb_strtoupper(trim($this->student_code))]);
        }
    }
}
