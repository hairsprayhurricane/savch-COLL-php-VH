<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\AdminVideoController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/videos', [VideoController::class, 'index']);
Route::get('/videos/{video}', [VideoController::class, 'show']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // User routes
    Route::post('/videos', [VideoController::class, 'store']);
    Route::post('/videos/{video}/like', [VideoController::class, 'like']);
    Route::post('/videos/{video}/comment', [VideoController::class, 'comment']);

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/videos', [AdminVideoController::class, 'index']);
        Route::patch('/admin/videos/{video}/restriction', [AdminVideoController::class, 'setRestriction']);
    });
});

