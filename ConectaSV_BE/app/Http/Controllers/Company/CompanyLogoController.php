<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use App\Support\PublicImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Logo de la empresa del usuario. Rutas con auth:sanctum + role:company + company.owner. */
class CompanyLogoController extends Controller
{
    /** POST /api/company/logo — sube o reemplaza el logo (multipart, campo "image"). */
    public function store(UploadImageRequest $request): JsonResponse
    {
        $company = $request->user()->companyMember->company;

        $company->update([
            'logo_path' => PublicImage::replace($request->file('image'), 'logos', $company->logo_path),
        ]);

        return response()->json(['logo_url' => $company->logoUrl()]);
    }

    /** DELETE /api/company/logo */
    public function destroy(Request $request): JsonResponse
    {
        $company = $request->user()->companyMember->company;

        PublicImage::delete($company->logo_path);
        $company->update(['logo_path' => null]);

        return response()->json(['logo_url' => null]);
    }
}
