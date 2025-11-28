<?php

use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\NoticeController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
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
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::get('/{order}', [OrderController::class, 'show'])->name('show');
        Route::put('/{order}/status', [OrderController::class, 'updateStatus'])->name('updateStatus');
    });

    // Users Management
    Route::prefix('users')->name('admin.users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/{user}', [UserController::class, 'show'])->name('show');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // Reviews Management
    Route::prefix('reviews')->name('admin.reviews.')->group(function () {
        Route::get('/', [ReviewController::class, 'index'])->name('index');
        Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('destroy');
        Route::put('/{review}/approve', [ReviewController::class, 'approve'])->name('approve');
    });

    // Coupons Management
    Route::prefix('coupons')->name('admin.coupons.')->group(function () {
        Route::get('/', [CouponController::class, 'index'])->name('index');
        Route::delete('/{coupon}', [CouponController::class, 'destroy'])->name('destroy');
        // Route::get('/create', [CouponController::class, 'create'])->name('create');
        // Route::post('/', [CouponController::class, 'store'])->name('store');
        // Route::get('/{coupon}/edit', [CouponController::class, 'edit'])->name('edit');
        // Route::put('/{coupon}', [CouponController::class, 'update'])->name('update');
    });

    // Payments Management
    Route::prefix('payments')->name('admin.payments.')->group(function () {
        Route::get('/', [PaymentController::class, 'index'])->name('index');
        Route::get('/{payment}', [PaymentController::class, 'show'])->name('show');
        Route::post('/{payment}/cancel', [PaymentController::class, 'cancel'])->name('cancel');
    });

    // FAQ Management
    Route::prefix('faqs')->name('admin.faqs.')->group(function () {
        Route::get('/', [FaqController::class, 'index'])->name('index');
        Route::get('/create', [FaqController::class, 'create'])->name('create');
        Route::post('/', [FaqController::class, 'store'])->name('store');
        Route::get('/{faq}/edit', [FaqController::class, 'edit'])->name('edit');
        Route::put('/{faq}', [FaqController::class, 'update'])->name('update');
        Route::delete('/{faq}', [FaqController::class, 'destroy'])->name('destroy');
    });

    // Notice Management
    Route::prefix('notices')->name('admin.notices.')->group(function () {
        Route::get('/', [NoticeController::class, 'index'])->name('index');
        Route::get('/create', [NoticeController::class, 'create'])->name('create');
        Route::post('/', [NoticeController::class, 'store'])->name('store');
        Route::get('/{notice}/edit', [NoticeController::class, 'edit'])->name('edit');
        Route::put('/{notice}', [NoticeController::class, 'update'])->name('update');
        Route::delete('/{notice}', [NoticeController::class, 'destroy'])->name('destroy');
    });

    // Inquiry Management
    Route::prefix('inquiries')->name('admin.inquiries.')->group(function () {
        Route::get('/', [InquiryController::class, 'index'])->name('index');
        Route::get('/{inquiry}', [InquiryController::class, 'show'])->name('show');
        Route::post('/{inquiry}/answer', [InquiryController::class, 'answer'])->name('answer');
        Route::delete('/{inquiry}', [InquiryController::class, 'destroy'])->name('destroy');
    });

    // Settings
    Route::prefix('settings')->name('admin.settings.')->group(function () {
        Route::get('/', [SettingController::class, 'index'])->name('index');
        Route::post('/', [SettingController::class, 'update'])->name('update');
    });
});
