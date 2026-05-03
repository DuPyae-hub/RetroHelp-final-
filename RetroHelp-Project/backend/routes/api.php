<?php

use App\Http\Controllers\ArtCenterController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NavigationController;
use App\Http\Controllers\PillDispenseController;
use App\Http\Controllers\ResourceLibraryController;
use Illuminate\Support\Facades\Route;

Route::get('/art-centers/search', [ArtCenterController::class, 'search']);
Route::get('/resource-libraries', [ResourceLibraryController::class, 'index']);

Route::post('/auth/login/patient', [AuthController::class, 'loginPatient']);
Route::post('/auth/login/staff', [AuthController::class, 'loginStaff']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::patch('/auth/profile', [AuthController::class, 'updateProfile']);

    Route::get('/art-centers/{artCenter}', [ArtCenterController::class, 'show']);

    Route::middleware('role:1')->group(function (): void {
        Route::post('/navigations', [NavigationController::class, 'store']);
        Route::get('/pill-dispenses/awaiting-receipt', [PillDispenseController::class, 'awaitingReceipt']);
        Route::patch(
            '/pill-dispenses/{pillDispense}/mark-received',
            [PillDispenseController::class, 'markReceived']
        );
    });

    Route::middleware('role:2,3')->group(function (): void {
        Route::get('/pill-dispenses/pending', [PillDispenseController::class, 'pendingForStaff']);
        Route::patch(
            '/pill-dispenses/{pillDispense}/mark-given',
            [PillDispenseController::class, 'markGiven']
        );
    });
});
