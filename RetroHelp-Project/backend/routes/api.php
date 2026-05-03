<?php

use App\Http\Controllers\ArtCenterController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PillDispenseController;
use Illuminate\Support\Facades\Route;

Route::get('/art-centers/search', [ArtCenterController::class, 'search']);

Route::post('/auth/login/patient', [AuthController::class, 'loginPatient']);
Route::post('/auth/login/staff', [AuthController::class, 'loginStaff']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    Route::middleware('role:2,3')->patch(
        '/pill-dispenses/{pillDispense}/mark-given',
        [PillDispenseController::class, 'markGiven']
    );

    Route::middleware('role:1')->patch(
        '/pill-dispenses/{pillDispense}/mark-received',
        [PillDispenseController::class, 'markReceived']
    );
});
