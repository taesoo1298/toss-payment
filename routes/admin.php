<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group and "admin" middleware.
|
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    // Admin Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Products Management
    Route::prefix('products')->name('admin.products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/create', [ProductController::class, 'create'])->name('create');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::get('/{product}', [ProductController::class, 'show'])->name('show');
        Route::get('/{product}/edit', [ProductController::class, 'edit'])->name('edit');
        Route::put('/{product}', [ProductController::class, 'update'])->name('update');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('destroy');
    });

    // Orders Management
    Route::prefix('orders')->name('admin.orders.')->group(function () {
        // Route::get('/', [OrderController::class, 'index'])->name('index');
        // Route::get('/{order}', [OrderController::class, 'show'])->name('show');
        // Route::put('/{order}/status', [OrderController::class, 'updateStatus'])->name('updateStatus');
    });

    // Users Management
    Route::prefix('users')->name('admin.users.')->group(function () {
        // Route::get('/', [UserController::class, 'index'])->name('index');
        // Route::get('/{user}', [UserController::class, 'show'])->name('show');
        // Route::put('/{user}', [UserController::class, 'update'])->name('update');
        // Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // Reviews Management
    Route::prefix('reviews')->name('admin.reviews.')->group(function () {
        // Route::get('/', [ReviewController::class, 'index'])->name('index');
        // Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('destroy');
        // Route::put('/{review}/approve', [ReviewController::class, 'approve'])->name('approve');
    });

    // Coupons Management
    Route::prefix('coupons')->name('admin.coupons.')->group(function () {
        // Route::get('/', [CouponController::class, 'index'])->name('index');
        // Route::get('/create', [CouponController::class, 'create'])->name('create');
        // Route::post('/', [CouponController::class, 'store'])->name('store');
        // Route::get('/{coupon}/edit', [CouponController::class, 'edit'])->name('edit');
        // Route::put('/{coupon}', [CouponController::class, 'update'])->name('update');
        // Route::delete('/{coupon}', [CouponController::class, 'destroy'])->name('destroy');
    });

    // Payments Management
    Route::prefix('payments')->name('admin.payments.')->group(function () {
        // Route::get('/', [PaymentController::class, 'index'])->name('index');
        // Route::get('/{payment}', [PaymentController::class, 'show'])->name('show');
    });

    // Settings
    Route::prefix('settings')->name('admin.settings.')->group(function () {
        // Route::get('/', [SettingsController::class, 'index'])->name('index');
        // Route::put('/', [SettingsController::class, 'update'])->name('update');
    });
});
