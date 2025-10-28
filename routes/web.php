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
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

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

require __DIR__.'/auth.php';
