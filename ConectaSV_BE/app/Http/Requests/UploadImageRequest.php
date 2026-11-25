<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** Cuerpo de las subidas de imagen (foto de perfil, logo): multipart con el campo "image". */
class UploadImageRequest extends FormRequest
{
    /** Tamaño máximo en kilobytes (2 MB). */
    public const MAX_KB = 2048;

    public function authorize(): bool
    {
        return true; // Quién puede subir lo deciden las rutas (auth:sanctum, company.owner).
    }

    public function rules(): array
    {
        return [
            'image' => [
                'required',
                // "image" revisa el CONTENIDO del archivo, no solo la extensión: un .exe
                // renombrado a .png no pasa. Sin SVG: puede llevar código incrustado.
                'image',
                'mimes:png,jpg,jpeg,webp',
                'max:'.self::MAX_KB,
                // Evita fotos enormes (de cámara) que pesan poco comprimidas pero gastan
                // mucha memoria al procesarlas, y miniaturas inservibles.
                'dimensions:min_width=64,min_height=64,max_width=4000,max_height=4000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'Selecciona una imagen.',
            'image.image' => 'El archivo debe ser una imagen.',
            'image.mimes' => 'La imagen debe ser PNG, JPG o WebP.',
            'image.max' => 'La imagen no puede pesar más de 2 MB.',
            'image.dimensions' => 'La imagen debe medir entre 64 y 4000 píxeles por lado.',
        ];
    }
}
