<?php

use App\Http\Controllers\AccountSettingController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CustomerCenterController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\MyPageController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\NotificationSettingController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserCouponController;
use App\Http\Controllers\WishlistController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        // 'featuredProducts' => [],
        // 'newProducts' => [],
    ]);
})->name('home');

// Product list page
Route::get('/products', [ProductController::class, 'index'])->name('products.index');

// Category pages
Route::get('/category/{category}', [ProductController::class, 'index'])->name('category.show');

// Product detail page
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Cart page and API
Route::get('/cart', [CartController::class, 'index'])->name('cart');

// Cart API routes (accessible to both guests and members)
Route::prefix('api/cart')->name('api.cart.')->group(function () {
    Route::get('/summary', [CartController::class, 'summary'])->name('summary');
    Route::post('/items', [CartController::class, 'store'])->name('store');
    Route::patch('/items/{productId}', [CartController::class, 'updateQuantity'])->name('updateQuantity');
    Route::delete('/items/{productId}', [CartController::class, 'destroy'])->name('destroy');
    Route::post('/items/remove-multiple', [CartController::class, 'destroyMultiple'])->name('destroyMultiple');
    Route::post('/clear', [CartController::class, 'clear'])->name('clear');
    Route::post('/coupon/apply', [CartController::class, 'applyCoupon'])->name('applyCoupon');
    Route::delete('/coupon', [CartController::class, 'removeCoupon'])->name('removeCoupon');
    Route::post('/merge', [CartController::class, 'mergeGuestCart'])->middleware('auth')->name('merge');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // MyPage routes
    Route::prefix('mypage')->name('mypage.')->group(function () {
        Route::get('/', [MyPageController::class, 'dashboard'])->name('dashboard');
        Route::get('/orders', [MyPageController::class, 'orderHistory'])->name('orders');
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
        Route::get('/addresses', [AddressController::class, 'index'])->name('addresses');
        Route::get('/payments', [PaymentMethodController::class, 'index'])->name('payments');
        Route::get('/notifications', [NotificationSettingController::class, 'index'])->name('notifications');
        Route::get('/coupons', [UserCouponController::class, 'index'])->name('coupons');
        Route::get('/settings', [AccountSettingController::class, 'index'])->name('settings');
    });

    // API routes for MyPage
    Route::prefix('api/mypage')->name('api.mypage.')->group(function () {
        // Order management
        Route::post('/orders/{order}/cancel', [MyPageController::class, 'cancelOrder'])->name('orders.cancel');
        Route::post('/orders/{order}/refund', [MyPageController::class, 'requestRefund'])->name('orders.refund');
        Route::post('/orders/{order}/exchange', [MyPageController::class, 'requestExchange'])->name('orders.exchange');

        // Address management
        Route::apiResource('addresses', AddressController::class);
        Route::post('/addresses/{address}/set-default', [AddressController::class, 'setDefault'])->name('addresses.setDefault');

        // Coupon management
        Route::get('/coupons', [UserCouponController::class, 'index'])->name('coupons.index');
        Route::post('/coupons/register', [UserCouponController::class, 'register'])->name('coupons.register');
        Route::get('/coupons/available', [UserCouponController::class, 'available'])->name('coupons.available');
        Route::get('/coupons/{userCoupon}', [UserCouponController::class, 'show'])->name('coupons.show');

        // Wishlist management
        Route::get('/wishlist', [WishlistController::class, 'list'])->name('wishlist.list');
        Route::get('/wishlist/check/{productId}', [WishlistController::class, 'check'])->name('wishlist.check');
        Route::post('/wishlist', [WishlistController::class, 'store'])->name('wishlist.store');
        Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
        Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
        Route::delete('/wishlist/product/{productId}', [WishlistController::class, 'destroyByProduct'])->name('wishlist.destroyByProduct');

        // Payment methods management
        Route::get('/payment-methods', [PaymentMethodController::class, 'list'])->name('paymentMethods.list');
        Route::post('/payment-methods', [PaymentMethodController::class, 'store'])->name('paymentMethods.store');
        Route::patch('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'update'])->name('paymentMethods.update');
        Route::post('/payment-methods/{paymentMethod}/set-default', [PaymentMethodController::class, 'setDefault'])->name('paymentMethods.setDefault');
        Route::delete('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'destroy'])->name('paymentMethods.destroy');

        // Notification settings
        Route::get('/notification-settings', [NotificationSettingController::class, 'show'])->name('notificationSettings.show');
        Route::patch('/notification-settings', [NotificationSettingController::class, 'update'])->name('notificationSettings.update');
        Route::patch('/notification-settings/{category}', [NotificationSettingController::class, 'updateCategory'])->name('notificationSettings.updateCategory');
        Route::post('/notification-settings/marketing-consent', [NotificationSettingController::class, 'updateMarketingConsent'])->name('notificationSettings.marketingConsent');
        Route::post('/notification-settings/do-not-disturb', [NotificationSettingController::class, 'updateDoNotDisturb'])->name('notificationSettings.doNotDisturb');

        // Account settings
        Route::patch('/account/profile', [AccountSettingController::class, 'updateProfile'])->name('account.updateProfile');
        Route::post('/account/password', [AccountSettingController::class, 'updatePassword'])->name('account.updatePassword');
        Route::patch('/account/privacy', [AccountSettingController::class, 'updatePrivacy'])->name('account.updatePrivacy');
        Route::post('/account/two-factor/enable', [AccountSettingController::class, 'enableTwoFactor'])->name('account.enableTwoFactor');
        Route::post('/account/two-factor/disable', [AccountSettingController::class, 'disableTwoFactor'])->name('account.disableTwoFactor');
        Route::delete('/account', [AccountSettingController::class, 'deleteAccount'])->name('account.delete');
        Route::get('/account/download-data', [AccountSettingController::class, 'downloadData'])->name('account.downloadData');
    });
});

// Checkout page
Route::get('/checkout', function () {
    return Inertia::render('Payment/Checkout');
})->middleware('auth')->name('checkout');

// Order complete page
Route::get('/order/complete', [OrderController::class, 'complete'])
    ->middleware('auth')
    ->name('order.complete');

// Order detail page
Route::get('/orders/{id}', [OrderController::class, 'show'])
    ->middleware('auth')
    ->name('orders.show');

// Payment routes
Route::prefix('payments')->name('payments.')->middleware('auth')->group(function () {
    Route::get('/create', function () {
        return Inertia::render('Payment/Create');
    })->name('create');

    Route::get('/success', function () {
        return Inertia::render('Payment/Success', [
            'paymentKey' => request()->query('paymentKey'),
            'orderId' => request()->query('orderId'),
            'amount' => request()->query('amount'),
        ]);
    })->name('success');

    Route::get('/fail', function () {
        return Inertia::render('Payment/Fail', [
            'code' => request()->query('code'),
            'message' => request()->query('message'),
            'orderId' => request()->query('orderId'),
        ]);
    })->name('fail');
});

// Customer Center routes
Route::prefix('customer-center')->name('customer-center.')->group(function () {
    // Main landing page
    Route::get('/', [CustomerCenterController::class, 'index'])->name('index');

    // FAQ
    Route::get('/faq/search', [FaqController::class, 'search'])->name('faq.search');
    Route::get('/faq', [FaqController::class, 'index'])->name('faq');
    Route::get('/faq/{id}', [FaqController::class, 'show'])->name('faq.show');
    Route::post('/faq/{id}/helpful', [FaqController::class, 'markHelpful'])->name('faq.helpful');

    // Notices
    Route::get('/notices/search', [NoticeController::class, 'search'])->name('notices.search');
    Route::get('/notices', [NoticeController::class, 'index'])->name('notices');
    Route::get('/notices/{id}', [NoticeController::class, 'show'])->name('notices.show');

    // Inquiries (1:1 Q&A) - require authentication
    Route::middleware('auth')->group(function () {
        Route::get('/inquiry', [InquiryController::class, 'index'])->name('inquiry');
        Route::get('/inquiry/create', [InquiryController::class, 'create'])->name('inquiry.create');
        Route::post('/inquiry', [InquiryController::class, 'store'])->name('inquiry.store');
        Route::get('/inquiry/{id}', [InquiryController::class, 'show'])->name('inquiry.show');
        Route::patch('/inquiry/{id}', [InquiryController::class, 'update'])->name('inquiry.update');
        Route::delete('/inquiry/{id}', [InquiryController::class, 'destroy'])->name('inquiry.destroy');
        Route::post('/inquiry/{id}/close', [InquiryController::class, 'close'])->name('inquiry.close');
    });
});

require __DIR__.'/auth.php';
