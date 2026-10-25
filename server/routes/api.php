<?php

use App\Http\Controllers\API\Admin\DashboardController;
use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\API\Order\uploads\ImageController;
use App\Http\Controllers\API\Order\OrderController;
use App\Http\Controllers\API\Product\ProductController;
use App\Http\Controllers\API\Role\PermissionController;
use App\Http\Controllers\API\Role\RoleController;
use App\Http\Controllers\API\User\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ─── Public ───────────────────────────────────────────────────────────
    Route::post('login',    [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);

    // ─── Authenticated ────────────────────────────────────────────────────
    Route::middleware('auth:api')->group(function () {
        // Dashboard chart
        // Logout
        Route::post('logout', [AuthController::class, 'logout']);

        // Current user profile
        Route::prefix('profile')->group(function () {
            Route::get('/',          [UserController::class, 'user']);
            Route::put('/info',      [UserController::class, 'updateInfo']);
            Route::put('/password',  [UserController::class, 'updatePassword']);
        });

        // ─── Admin only ───────────────────────────────────────────────────
        Route::middleware('role:Admin')->group(function () {
            Route::apiResource('users', UserController::class);
            Route::apiResource('roles', RoleController::class);
            // __ Permissions
            Route::apiResource('permissions',PermissionController::class)->only(['index', 'store']);
        });

        // ─── Admin + editor ───────────────────────────────────────────────
        Route::middleware('role:Admin,Editor')->group(function () {
            Route::apiResource('products', ProductController::class);
            Route::post('uploads', [ImageController::class, 'upload']);
            Route::get('chart', [DashboardController::class, 'chart']);

        });

        // ─── Any authenticated user ───────────────────────────────────────
        Route::get('orders/export', [OrderController::class, 'export']);
        Route::apiResource('orders', OrderController::class)->only(['index', 'show']);

    });
});
