<?php

use App\Http\Controllers\Payment\TossPaymentController;
use App\Http\Controllers\Payment\TossWebhookController;
use App\Http\Middleware\VerifyTossWebhookSignature;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
*/

Route::prefix('payments')->name('payments.')->group(function () {

    // Webhook route (with signature verification)
    Route::post('/webhook/toss', [TossWebhookController::class, 'handle'])
        ->middleware(VerifyTossWebhookSignature::class)
        ->name('webhook.toss');

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {

        // Payment management
        Route::get('/', [TossPaymentController::class, 'index'])
            ->name('index');

        Route::post('/prepare', [TossPaymentController::class, 'prepare'])
            ->name('prepare');

        Route::post('/confirm', [TossPaymentController::class, 'confirm'])
            ->name('confirm');

        Route::get('/{orderId}', [TossPaymentController::class, 'show'])
            ->name('show');

        Route::post('/{orderId}/cancel', [TossPaymentController::class, 'cancel'])
            ->name('cancel');
    });
});
