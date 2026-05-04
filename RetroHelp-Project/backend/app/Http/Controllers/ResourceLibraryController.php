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

    /**
     * Clinic staff and administrators: publish a library article.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:60000'],
            'category' => ['nullable', 'string', 'max:255'],
        ]);

        $item = ResourceLibrary::query()->create($data);

        return response()->json([
            'message' => 'Article published to the library.',
            'data' => $item,
        ], 201);
    }
}
