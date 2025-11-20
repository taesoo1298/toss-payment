<?php

namespace App\Providers;

use App\Events\Payment\PaymentCancelled;
use App\Events\Payment\PaymentCompleted;
use App\Events\Payment\PaymentFailed;
use App\Listeners\Payment\SendPaymentConfirmationEmail;
use App\Listeners\Payment\UpdateOrderStatus;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use SocialiteProviders\Manager\SocialiteWasCalled;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        PaymentCompleted::class => [
            SendPaymentConfirmationEmail::class,
            UpdateOrderStatus::class,
        ],

        PaymentFailed::class => [
            // Add listeners for payment failure
            // e.g., SendPaymentFailureNotification::class,
        ],

        PaymentCancelled::class => [
            // Add listeners for payment cancellation
            // e.g., ProcessRefund::class,
            // e.g., SendCancellationEmail::class,
        ],

        SocialiteWasCalled::class => [
            \SocialiteProviders\Kakao\KakaoExtendSocialite::class,
            \SocialiteProviders\Naver\NaverExtendSocialite::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
