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
use App\Support\AuthSession;
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

        $user = DB::transaction(function () use ($data) {
            $user = User::createWithRole($data, UserRole::STUDENT);

            $profile = $user->studentProfile()->create([
                'university_id' => $data['university_id'],
                'career_id' => $data['career_id'],
                'student_code' => $data['student_code'],
            ]);

            $profile->interests()->sync($data['interests']);

            return $user;
        });

        return AuthSession::respond($user, 201);
    }

    public function registerCompany(RegisterCompanyRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data) {
            $user = User::createWithRole($data, UserRole::COMPANY);

            $company = Company::create([
                'sector_id' => $data['sector_id'],
                'name' => $data['company_name'],
                'web_site' => $data['web_site'] ?? null,
                'contact_number' => $data['contact_number'],
            ]);

            $company->members()->create([
                'user_id' => $user->id,
                'company_role_id' => CompanyRole::where('name', CompanyRole::OWNER)->firstOrFail()->id,
                'phone' => $data['phone'] ?? null,
            ]);

            return $user;
        });

        return AuthSession::respond($user, 201);
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

        return AuthSession::respond($user);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource(AuthSession::loadProfile($request->user())),
        ]);
    }
}