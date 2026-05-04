<?php

namespace App\Http\Controllers;

use App\Models\ArtCenter;
use App\Models\Booking;
use App\Models\User;
use App\Support\RoleId;
use Illuminate\Http\JsonResponse;

class AdminOverviewController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'data' => [
                'users' => [
                    'total' => User::query()->count(),
                    'patients' => User::query()->where('role_id', RoleId::Patient)->count(),
                    'clinic_staff' => User::query()->where('role_id', RoleId::ClinicStaff)->count(),
                    'admins' => User::query()->where('role_id', RoleId::Admin)->count(),
                    'pending_clinic_staff' => User::query()
                        ->where('role_id', RoleId::ClinicStaff)
                        ->where('is_verified', false)
                        ->count(),
                ],
                'art_centers' => [
                    'total' => ArtCenter::query()->count(),
                    'pending_verification' => ArtCenter::query()->where('is_verified', false)->count(),
                ],
                'bookings' => [
                    'total' => Booking::query()->count(),
                    'by_status' => Booking::query()
                        ->selectRaw('status, COUNT(*) as c')
                        ->groupBy('status')
                        ->pluck('c', 'status')
                        ->all(),
                ],
            ],
        ]);
    }
}
