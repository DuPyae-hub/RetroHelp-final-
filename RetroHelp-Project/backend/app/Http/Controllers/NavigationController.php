<?php

namespace App\Http\Controllers;

use App\Models\ArtCenter;
use App\Models\Navigation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NavigationController extends Controller
{
    /**
     * Community member: list own saved navigation / visit plans (newest first).
     */
    public function index(Request $request): JsonResponse
    {
        $rows = Navigation::query()
            ->where('user_id', $request->user()->id)
            ->with(['artCenter:id,name,township,area'])
            ->orderByDesc('created_at')
            ->limit(100)
            ->get([
                'navigation_id',
                'start_location',
                'destination',
                'art_center_id',
                'created_at',
            ]);

        return response()->json(['data' => $rows]);
    }

    /**
     * Record a community member’s intent to visit an ART center (navigation event).
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'art_center_id' => ['required', 'integer', 'exists:art_centers,id'],
            'start_location' => ['nullable', 'string', 'max:255'],
        ]);

        $center = ArtCenter::query()->findOrFail($data['art_center_id']);

        $navigation = Navigation::query()->create([
            'user_id' => $request->user()->id,
            'start_location' => $data['start_location'] ?? null,
            'destination' => $center->name,
            'art_center_id' => $center->id,
        ]);

        return response()->json([
            'message' => 'Navigation recorded.',
            'data' => [
                'navigation_id' => $navigation->navigation_id,
                'destination' => $navigation->destination,
                'art_center_id' => $navigation->art_center_id,
            ],
        ], 201);
    }
}
