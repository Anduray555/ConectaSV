<?php

namespace App\Support;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

/**
 * Respuesta de "sesión iniciada": { token, user }.
 * La usan login, registro y aceptar una invitación, para que las tres respondan igual.
 */
class AuthSession
{
    public static function respond(User $user, int $status = 200): JsonResponse
    {
        return response()->json([
            'token' => $user->createToken('api')->plainTextToken,
            'user' => new UserResource(self::loadProfile($user)),
        ], $status);
    }

    /** Carga todas las relaciones que UserResource necesita (en pocas consultas). */
    public static function loadProfile(User $user): User
    {
        return $user->load([
            'role',
            'studentProfile.university',
            'studentProfile.career',
            'studentProfile.interests',
            'studentProfile.tags',
            'companyMember.companyRole',
            'companyMember.company.sector',
        ]);
    }
}
