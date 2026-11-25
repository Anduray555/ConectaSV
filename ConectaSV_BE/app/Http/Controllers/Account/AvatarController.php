<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use App\Support\PublicImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Foto de perfil del usuario autenticado (cualquier rol). Rutas con auth:sanctum. */
class AvatarController extends Controller
{
    /** POST /api/me/avatar — sube o reemplaza la foto (multipart, campo "image"). */
    public function store(UploadImageRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->update([
            'avatar_path' => PublicImage::replace($request->file('image'), 'avatars', $user->avatar_path),
        ]);

        return response()->json(['avatar_url' => $user->avatarUrl()]);
    }

    /** DELETE /api/me/avatar — quita la foto y vuelven a mostrarse las iniciales. */
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        PublicImage::delete($user->avatar_path);
        $user->update(['avatar_path' => null]);

        return response()->json(['avatar_url' => null]);
    }
}
