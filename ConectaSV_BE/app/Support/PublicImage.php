<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Imágenes públicas (fotos de perfil, logos) guardadas en el disco "public".
 *
 * En la base de datos solo se guarda la ruta relativa ("avatars/aB3x.png"). Así, si mañana
 * el disco "public" pasa a ser S3, solo cambia config/filesystems.php y no este código.
 */
class PublicImage
{
    private const DISK = 'public';

    /**
     * Guarda la imagen nueva en $folder y borra la anterior (si había).
     * Devuelve la ruta nueva para guardarla en la base de datos.
     */
    public static function replace(UploadedFile $file, string $folder, ?string $oldPath): string
    {
        // store() genera un nombre aleatorio único: nunca usamos el nombre que manda el usuario
        // (podría chocar con otro archivo o traer caracteres peligrosos).
        $path = $file->store($folder, self::DISK);

        // Se borra DESPUÉS de guardar la nueva: si guardar falla, no perdemos la anterior.
        self::delete($oldPath);

        return $path;
    }

    public static function delete(?string $path): void
    {
        if ($path) {
            Storage::disk(self::DISK)->delete($path);
        }
    }

    /** URL completa para el frontend, o null si no hay imagen. */
    public static function url(?string $path): ?string
    {
        return $path ? Storage::disk(self::DISK)->url($path) : null;
    }
}
