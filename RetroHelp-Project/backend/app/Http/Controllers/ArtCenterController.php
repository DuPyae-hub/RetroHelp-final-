<?php

namespace App\Http\Controllers;

use App\Models\ArtCenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArtCenterController extends Controller
{
    /**
     * Top clinics for public home: ranked by pill handout success (Given + Received) and feedback scores.
     */
    public function topRanked(Request $request): JsonResponse
    {
        $limit = min(max((int) $request->query('limit', 12), 1), 30);

        $query = ArtCenter::query()
            ->select([
                'art_centers.id',
                'art_centers.name',
                'art_centers.township',
                'art_centers.area',
                'art_centers.rating_avg',
                'art_centers.total_reviews',
                'art_centers.is_verified',
            ])
            ->withCount([
                'pillDispenses as pill_success_count' => static function ($q): void {
                    $q->whereIn('status', ['Given', 'Received']);
                },
            ])
            ->orderByDesc('pill_success_count')
            ->orderByDesc('rating_avg')
            ->orderByDesc('total_reviews')
            ->orderBy('art_centers.name')
            ->limit($limit);

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    /**
     * Privacy-first listing: filter by township and/or area only; omit direct contact and coordinates.
     * Results are ranked by completed pill dispenses (status Received) at each center.
     */
    public function search(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'township' => ['nullable', 'string', 'max:255'],
            'area' => ['nullable', 'string', 'max:255'],
        ]);

        $query = ArtCenter::query()
            ->select([
                'art_centers.id',
                'art_centers.name',
                'art_centers.township',
                'art_centers.area',
                'art_centers.is_verified',
                'art_centers.rating_avg',
                'art_centers.total_reviews',
            ])
            ->withCount([
                'pillDispenses as completed_dispenses_count' => static function ($q): void {
                    $q->where('status', 'Received');
                },
            ]);

        if (! empty($filters['township'])) {
            $query->where('township', $filters['township']);
        }

        if (! empty($filters['area'])) {
            $query->where('area', $filters['area']);
        }

        $query->orderByDesc('completed_dispenses_count')
            ->orderBy('art_centers.name');

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    /**
     * Map-safe details for authenticated users only (coordinates are not exposed in public search).
     */
    public function show(ArtCenter $artCenter): JsonResponse
    {
        return response()->json([
            'data' => [
                'id' => $artCenter->id,
                'name' => $artCenter->name,
                'township' => $artCenter->township,
                'area' => $artCenter->area,
                'latitude' => $artCenter->latitude,
                'longitude' => $artCenter->longitude,
                'is_verified' => (bool) $artCenter->is_verified,
            ],
        ]);
    }
}
