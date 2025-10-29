<?php

use App\Http\Controllers\ProfileController;
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
Route::get('/products', function () {
    return Inertia::render('Products/ProductList', [
        'category' => request()->query('category', 'all'),
    ]);
})->name('products.index');

// Category pages
Route::get('/category/{category}', function ($category) {
    return Inertia::render('Products/ProductList', [
        'category' => $category,
    ]);
})->name('category.show');

// Product detail page
Route::get('/products/{id}', function ($id) {
    return Inertia::render('ProductDetail', [
        // 'product' => Product::find($id),
        // 'relatedProducts' => Product::where('category', $product->category)->limit(4)->get(),
    ]);
})->name('products.show');

// Cart page
Route::get('/cart', function () {
    return Inertia::render('Cart');
})->name('cart');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.eit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // MyPage routes
    Route::prefix('mypage')->name('mypage.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('MyPage/Dashboard');
        })->name('dashboard');

        Route::get('/orders', function () {
            return Inertia::render('MyPage/OrderHistory');
        })->name('orders');

        Route::get('/wishlist', function () {
            return Inertia::render('MyPage/Wishlist');
        })->name('wishlist');

        Route::get('/addresses', function () {
            return Inertia::render('MyPage/Addresses');
        })->name('addresses');

        Route::get('/payments', function () {
            return Inertia::render('MyPage/PaymentMethods');
        })->name('payments');

        Route::get('/notifications', function () {
            return Inertia::render('MyPage/Notifications');
        })->name('notifications');

        Route::get('/coupons', function () {
            return Inertia::render('MyPage/Coupons');
        })->name('coupons');
    });
});

// Checkout page
Route::get('/checkout', function () {
    return Inertia::render('Payment/Checkout');
})->middleware('auth')->name('checkout');

// Order complete page
Route::get('/order/complete', function () {
    return Inertia::render('Payment/OrderComplete', [
        'orderId' => request()->query('orderId'),
        'paymentKey' => request()->query('paymentKey'),
        'amount' => request()->query('amount'),
    ]);
})->middleware('auth')->name('order.complete');

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

Route::get('/profile', [ProfileController::class, 'edit'])->middleware('auth')->name('profile.edit');

require __DIR__.'/auth.php';
