<?php

namespace App\Http\Controllers;

use App\Models\ArtCenter;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PublicOverviewController extends Controller
{
    public function show(): JsonResponse
    {
        $pillGiven = Booking::query()
            ->whereIn('status', [Booking::STATUS_PILL_GIVEN, Booking::STATUS_COMPLETED])
            ->count();

        return response()->json([
            'data' => [
                'users_count' => User::query()->count(),
                'pill_given_count' => $pillGiven,
                'clinics_count' => ArtCenter::query()->count(),
            ],
        ]);
    }
}
