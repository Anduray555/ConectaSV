<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterCompanyRequest;
use App\Http\Requests\Auth\RegisterStudentRequest;
use App\Http\Resources\UserResource;
use App\Models\Company;
use App\Models\CompanyRole;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function registerStudent(RegisterStudentRequest $request): JsonResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data) {
            $user = $this->createUser($data, UserRole::STUDENT);

            $user->studentProfile()->create([
                'university_id' => $data['university_id'],
                'career_id' => $data['career_id'],
                'student_code' => $data['student_code'],
            ]);
        });

        return response()->json([
            'message' => 'Registro exitoso. Ya puedes iniciar sesión.',
        ], 201);
    }

    public function registerCompany(RegisterCompanyRequest $request): JsonResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data) {
            $user = $this->createUser($data, UserRole::COMPANY);

            $company = Company::create([
                'sector_id' => $data['sector_id'],
                'name' => $data['company_name'],
                'web_site' => $data['web_site'] ?? null,
                'contact_number' => $data['contact_number'],
            ]);

            $company->members()->create([
                'user_id' => $user->id,
                'company_role_id' => CompanyRole::where('name', CompanyRole::OWNER)->firstOrFail()->id,
                'phone' => $data['phone'],
            ]);
        });

        return response()->json([
            'message' => 'Registro exitoso. Ya puedes iniciar sesión.',
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Tu cuenta está desactivada.'], 403);
        }

        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
            'user' => new UserResource($this->loadProfile($user)),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($this->loadProfile($request->user())),
        ]);
    }

    private function createUser(array $data, string $roleName): User
    {
        return User::create([
            'role_id' => UserRole::where('name', $roleName)->firstOrFail()->id,
            'first_name' => $data['first_name'],
            'second_name' => $data['second_name'] ?? null,
            'first_surname' => $data['first_surname'],
            'second_surname' => $data['second_surname'] ?? null,
            'email' => $data['email'],
            'password' => $data['password'],
        ]);
    }

    private function loadProfile(User $user): User
    {
        return $user->load([
            'role',
            'studentProfile.university',
            'studentProfile.career',
            'companyMember.companyRole',
            'companyMember.company.sector',
        ]);
    }
}