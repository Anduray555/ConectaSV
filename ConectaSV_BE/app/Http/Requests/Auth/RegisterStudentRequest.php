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
        ]);
    }
}