<?php

use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Account\AvatarController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\InvitationAcceptController;
use App\Http\Controllers\Company\CompanyLogoController;
use App\Http\Controllers\Company\CompanyOnboardingController;
use App\Http\Controllers\Company\InvitationController;
use App\Http\Controllers\Company\MemberController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\Student\OnboardingController;
use App\Http\Controllers\Student\StudentTagController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json([
    'app' => 'ConectaSV API',
    'status' => 'ok',
]));

Route::get('/universities', [CatalogController::class, 'universities']);
Route::get('/universities/{university}/careers', [CatalogController::class, 'careers']);
Route::get('/sectors', [CatalogController::class, 'sectors']);
Route::get('/offer-types', [CatalogController::class, 'offerTypes']);
Route::get('/tags', [CatalogController::class, 'tags']);

Route::prefix('auth')->group(function () {
    Route::post('/register/student', [AuthController::class, 'registerStudent']);
    Route::post('/register/company', [AuthController::class, 'registerCompany']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Cuenta propia (cualquier rol): foto de perfil.
Route::prefix('me')->middleware('auth:sanctum')->group(function () {
    Route::post('/avatar', [AvatarController::class, 'store']);
    Route::delete('/avatar', [AvatarController::class, 'destroy']);
});

// Empresa, solo owner: logo, invitaciones y la pantalla "Invita a tu equipo".
Route::prefix('company')->middleware(['auth:sanctum', 'role:company', 'company.owner'])->group(function () {
    Route::post('/logo', [CompanyLogoController::class, 'store']);
    Route::delete('/logo', [CompanyLogoController::class, 'destroy']);

    Route::get('/invitations', [InvitationController::class, 'index']);
    // throttle: máximo 20 invitaciones por minuto (cada una puede enviar un correo).
    Route::post('/invitations', [InvitationController::class, 'store'])->middleware('throttle:20,1');
    Route::delete('/invitations/{invitation}', [InvitationController::class, 'destroy']);

    Route::post('/onboarding', CompanyOnboardingController::class);

    Route::get('/members', [MemberController::class, 'index']);
    Route::patch('/members/{member}/status', [MemberController::class, 'updateStatus']);
});

// Invitaciones, PÚBLICAS: quien abre el link aún no tiene cuenta.
// throttle: evita que alguien pruebe tokens al azar.
Route::prefix('invitations')->middleware('throttle:20,1')->group(function () {
    Route::get('/{token}', [InvitationAcceptController::class, 'show']);
    Route::post('/{token}/accept', [InvitationAcceptController::class, 'accept']);
});

// Estudiante: requiere sesión y rol student.
Route::prefix('student')->middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::get('/tags', [StudentTagController::class, 'index']);
    Route::put('/tags', [StudentTagController::class, 'update']);
    Route::post('/onboarding', OnboardingController::class);
});

// Panel de administración: requiere sesión (auth:sanctum) y rol admin (role:admin).
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/summary', [AdminUserController::class, 'summary']);
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::patch('/users/{user}/status', [AdminUserController::class, 'updateStatus']);
});