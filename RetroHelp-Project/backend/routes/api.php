<?php

use App\Http\Controllers\AdminArtCentersController;
use App\Http\Controllers\AdminClinicStaffController;
use App\Http\Controllers\AdminOverviewController;
use App\Http\Controllers\ArtCenterController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\NavigationController;
use App\Http\Controllers\PublicOverviewController;
use App\Http\Controllers\PublicReviewController;
use App\Http\Controllers\ResourceLibraryController;
use App\Http\Controllers\SupportChatController;
use Illuminate\Support\Facades\Route;

Route::get('/art-centers/top-ranked', [ArtCenterController::class, 'topRanked']);
Route::get('/art-centers/search', [ArtCenterController::class, 'search']);
Route::get('/resource-libraries', [ResourceLibraryController::class, 'index']);
Route::get('/overview/public', [PublicOverviewController::class, 'show']);
Route::get('/reviews/recent', [PublicReviewController::class, 'recent']);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/register/patient', [AuthController::class, 'registerPatient']);
Route::post('/auth/login/patient', [AuthController::class, 'loginPatient']);
Route::post('/auth/login/staff', [AuthController::class, 'loginStaff']);

Route::post('/support/chat', [SupportChatController::class, 'chat'])
    ->middleware(['optional.sanctum', 'throttle:support-chat']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::patch('/auth/profile', [AuthController::class, 'updateProfile']);

    Route::get('/art-centers/{artCenter}', [ArtCenterController::class, 'show']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);

    Route::middleware(['staff.approved'])->group(function (): void {
        Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
    });

    Route::middleware('role:1')->group(function (): void {
        Route::post('/bookings', [BookingController::class, 'store']);
        Route::patch('/bookings/{booking}/on-my-way', [BookingController::class, 'onMyWay']);
        Route::patch('/bookings/{booking}/arrived', [BookingController::class, 'arrived']);
        Route::patch('/bookings/{booking}/complete', [BookingController::class, 'complete']);

        Route::get('/navigations', [NavigationController::class, 'index']);
        Route::post('/navigations', [NavigationController::class, 'store']);
    });

    Route::middleware(['role:2,3', 'staff.approved'])->group(function (): void {
        Route::post('/resource-libraries', [ResourceLibraryController::class, 'store']);
        Route::patch('/art-centers/{artCenter}/availability', [ArtCenterController::class, 'updateAvailability']);

        Route::patch('/bookings/{booking}/accept', [BookingController::class, 'accept']);
        Route::patch('/bookings/{booking}/pill-given', [BookingController::class, 'pillGiven']);

    });

    Route::middleware('role:3')->group(function (): void {
        Route::get('/admin/overview', [AdminOverviewController::class, 'show']);
        Route::get('/admin/art-centers/pending', [AdminArtCentersController::class, 'pending']);
        Route::post('/admin/art-centers/{artCenter}/verify', [AdminArtCentersController::class, 'verify']);

        Route::get('/admin/clinic-staff/pending', [AdminClinicStaffController::class, 'pending']);
        Route::post('/admin/clinic-staff/{user}/approve', [AdminClinicStaffController::class, 'approve']);
    });
});
