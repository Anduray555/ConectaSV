<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CatalogController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json([
    'app' => 'ConectaSV API',
    'status' => 'ok',
]));

Route::get('/universities', [CatalogController::class, 'universities']);
Route::get('/universities/{university}/careers', [CatalogController::class, 'careers']);
Route::get('/sectors', [CatalogController::class, 'sectors']);

Route::prefix('auth')->group(function () {
    Route::post('/register/student', [AuthController::class, 'registerStudent']);
    Route::post('/register/company', [AuthController::class, 'registerCompany']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});