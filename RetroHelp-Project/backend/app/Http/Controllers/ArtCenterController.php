<?php

namespace App\Http\Controllers;

use App\Models\ArtCenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArtCenterController extends Controller
{
    /**
     * Top clinics for public home: ranked by booking-flow pill handouts (pill_given + completed),
     * then average rating and review volume.
     */
    public function topRanked(Request $request): JsonResponse
    {
        $limit = min(max((int) $request->query('limit', 12), 1), 30);

        $query = ArtCenter::query()
            ->select([
                'art_centers.id',
                'art_centers.name',
                'art_centers.nickname',
                'art_centers.image',
                'art_centers.township',
                'art_centers.area',
                'art_centers.rating_avg',
                'art_centers.total_reviews',
                'art_centers.is_verified',
            ])
            ->withCount([
                'bookings as booking_pill_given_count' => static function ($q): void {
                    $q->whereIn('status', ['pill_given', 'completed']);
                },
            ])
            ->orderByRaw('COALESCE(booking_pill_given_count, 0) DESC')
            ->orderByDesc('rating_avg')
            ->orderByDesc('total_reviews')
            ->orderBy('art_centers.name')
            ->limit($limit);

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    /**
     * Privacy-first listing: optional keyword search; omit direct contact and coordinates.
     * Results are ranked by completed visit requests (bookings with status completed).
     */
    public function search(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:500'],
        ]);

        $q = isset($filters['q']) ? trim($filters['q']) : '';
        $limit = min(max((int) ($filters['limit'] ?? 150), 1), 500);

        $query = ArtCenter::query()
            ->select([
                'art_centers.id',
                'art_centers.name',
                'art_centers.nickname',
                'art_centers.image',
                'art_centers.township',
                'art_centers.area',
                'art_centers.is_verified',
                'art_centers.rating_avg',
                'art_centers.total_reviews',
            ])
            ->withCount([
                'bookings as completed_bookings_count' => static function ($q): void {
                    $q->where('status', 'completed');
                },
            ]);

        if ($q !== '') {
            $like = '%'.addcslashes($q, '%_\\').'%';
            $query->where(static function ($sub) use ($like): void {
                $sub->where('art_centers.name', 'like', $like)
                    ->orWhere('art_centers.township', 'like', $like)
                    ->orWhere('art_centers.area', 'like', $like);
            });
        }

        $query->orderByRaw('COALESCE(completed_bookings_count, 0) DESC')
            ->orderByDesc('rating_avg')
            ->orderBy('art_centers.name')
            ->limit($limit);

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
                'image' => $artCenter->image,
                'latitude' => $artCenter->latitude,
                'longitude' => $artCenter->longitude,
                'is_verified' => (bool) $artCenter->is_verified,
            ],
        ]);
    }
}
