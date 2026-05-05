<?php

namespace App\Http\Controllers;

use App\Models\ArtCenter;
use Illuminate\Http\JsonResponse;

class AdminArtCentersController extends Controller
{
    /**
     * Directory listings that still need administrator verification.
     */
    public function pending(): JsonResponse
    {
        $rows = ArtCenter::query()
            ->where('is_verified', false)
            ->orderBy('created_at')
            ->get([
                'id',
                'name',
                'nickname',
                'image',
                'township',
                'area',
                'contact_no',
                'created_at',
            ]);

        return response()->json(['data' => $rows]);
    }

    public function verify(ArtCenter $artCenter): JsonResponse
    {
        if ($artCenter->is_verified) {
            return response()->json([
                'message' => 'This listing is already verified.',
                'data' => $artCenter,
            ]);
        }

        $artCenter->update(['is_verified' => true]);

        return response()->json([
            'message' => 'Clinic listing marked as verified.',
            'data' => $artCenter->fresh(),
        ]);
    }
}
