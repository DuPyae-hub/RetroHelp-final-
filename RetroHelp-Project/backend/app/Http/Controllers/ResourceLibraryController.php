<?php

namespace App\Http\Controllers;

use App\Models\ResourceLibrary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResourceLibraryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'category' => ['nullable', 'string', 'max:255'],
        ]);

        $query = ResourceLibrary::query()->orderBy('title');

        if (! empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }
}
