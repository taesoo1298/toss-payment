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
    // Get featured products (best sellers)
    $featuredProducts = \App\Models\Product::query()
        ->active()
        ->where('is_best_seller', true)
        ->with('category')
        ->orderBy('sold_count', 'desc')
        ->limit(8)
        ->get()
        ->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->short_description ?? $product->description,
                'price' => (int) $product->price,
                'originalPrice' => $product->original_price ? (int) $product->original_price : null,
                'image' => $product->main_image ?? 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80',
                'category' => $product->category->name ?? '전체상품',
                'badge' => $product->is_best_seller ? 'BEST' : ($product->is_new ? 'NEW' : null),
                'rating' => (float) $product->rating,
                'reviewCount' => $product->review_count,
            ];
        });

    return Inertia::render('Home', [
        'featuredProducts' => $featuredProducts,
    ]);
})->name('home');

// Product list page
Route::get('/products', [ProductController::class, 'index'])->name('products.index');

// Category pages
Route::get('/category/{category}', [ProductController::class, 'index'])->name('category.show');

// Product detail page
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');

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
Route::get('/checkout', function (Illuminate\Http\Request $request) {
    $user = $request->user();

    // Get cart items
    $cartItems = \App\Models\CartItem::with('product')
        ->whereHas('cart', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->product_id,
                'name' => $item->product->name,
                'price' => (int) $item->product->price,
                'quantity' => $item->quantity,
                'image' => $item->product->main_image ?? 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&q=80',
            ];
        });

    // Get available coupons
    $availableCoupons = \App\Models\UserCoupon::with('coupon')
        ->where('user_id', $user->id)
        ->where('status', 'available')
        ->whereHas('coupon', function ($query) {
            $query->where('is_active', true)
                ->where(function ($q) {
                    $q->whereNull('valid_until')
                      ->orWhere('valid_until', '>=', now());
                });
        })
        ->get()
        ->map(function ($userCoupon) {
            $coupon = $userCoupon->coupon;
            return [
                'id' => (string) $userCoupon->id,
                'code' => $coupon->code,
                'name' => $coupon->name,
                'description' => $coupon->description,
                'discountType' => $coupon->discount_type,
                'discountValue' => (float) $coupon->discount_value,
                'minPurchaseAmount' => (float) $coupon->min_purchase_amount,
                'maxDiscountAmount' => $coupon->max_discount_amount ? (float) $coupon->max_discount_amount : null,
            ];
        });

    // Get saved addresses
    $savedAddresses = \App\Models\Address::where('user_id', $user->id)
        ->orderBy('is_default', 'desc')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($address) {
            return [
                'id' => (string) $address->id,
                'name' => $address->name,
                'recipient' => $address->recipient,
                'phone' => $address->phone,
                'postalCode' => $address->postal_code,
                'address' => $address->address,
                'addressDetail' => $address->address_detail,
                'isDefault' => $address->is_default,
                'type' => $address->type,
            ];
        });

    return Inertia::render('Payment/Checkout', [
        'items' => $cartItems,
        'availableCoupons' => $availableCoupons,
        'savedAddresses' => $savedAddresses,
    ]);
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

// Legal Pages
Route::prefix('legal')->name('legal.')->group(function () {
    Route::get('/terms', function () {
        return Inertia::render('Legal/TermsOfService');
    })->name('terms');

    Route::get('/privacy', function () {
        return Inertia::render('Legal/PrivacyPolicy');
    })->name('privacy');
});

// Info Pages
Route::prefix('info')->name('info.')->group(function () {
    Route::get('/return-policy', function () {
        return Inertia::render('Info/ReturnPolicy');
    })->name('return-policy');

    Route::get('/subscription', function () {
        return Inertia::render('Info/SubscriptionGuide');
    })->name('subscription');

    Route::get('/partnership', function () {
        return Inertia::render('Info/Partnership');
    })->name('partnership');
});

// About Pages
Route::prefix('about')->name('about.')->group(function () {
    Route::get('/brand', function () {
        return Inertia::render('About/BrandStory');
    })->name('brand');

    Route::get('/dentist', function () {
        return Inertia::render('About/Dentist');
    })->name('dentist');

    Route::get('/clinical', function () {
        return Inertia::render('About/ClinicalTest');
    })->name('clinical');
});

// Support Pages
Route::prefix('support')->name('support.')->group(function () {
    Route::get('/consultation', function () {
        return Inertia::render('Support/Consultation');
    })->name('consultation');

    Route::get('/delivery', function () {
        return Inertia::render('Support/DeliveryTracking');
    })->name('delivery');
});

require __DIR__.'/auth.php';
