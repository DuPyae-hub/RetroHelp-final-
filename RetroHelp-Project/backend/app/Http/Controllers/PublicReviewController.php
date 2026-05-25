<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicReviewController extends Controller
{
    /**
     * Recent clinic reviews for the public home page (nickname only).
     */
    public function recent(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 8);
        $limit = max(1, min($limit, 30));

        $rows = Review::query()
            ->with([
                'clinic:id,name,township,area,rating_avg,total_reviews',
                'user:id,nickname',
            ])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(static function (Review $review) {
                $clinic = $review->clinic;
                $nickname = $review->user?->nickname;

                return [
                    'id' => $review->id,
                    'rating' => (int) $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at?->toIso8601String(),
                    'author_label' => $nickname && trim($nickname) !== ''
                        ? trim($nickname)
                        : 'Community member',
                    'clinic' => $clinic ? [
                        'id' => $clinic->id,
                        'name' => $clinic->name,
                        'township' => $clinic->township,
                        'area' => $clinic->area,
                        'rating_avg' => $clinic->rating_avg,
                        'total_reviews' => (int) ($clinic->total_reviews ?? 0),
                    ] : null,
                ];
            })
            ->values();

        return response()->json(['data' => $rows]);
    }
}
