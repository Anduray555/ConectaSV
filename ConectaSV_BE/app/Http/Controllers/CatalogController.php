<?php

namespace App\Http\Controllers;

use App\Models\Sector;
use App\Models\University;
use Illuminate\Http\JsonResponse;

class CatalogController extends Controller
{
    public function universities(): JsonResponse
    {
        return response()->json(
            University::orderBy('name')->get(['id', 'name', 'short_name'])
        );
    }

    public function careers(University $university): JsonResponse
    {
        return response()->json(
            $university->careers()->orderBy('name')->get(['id', 'name'])
        );
    }

    public function sectors(): JsonResponse
    {
        return response()->json(
            Sector::orderBy('name')->get(['id', 'name'])
        );
    }
}