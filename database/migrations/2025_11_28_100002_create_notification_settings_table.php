<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notification_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');

            // Email notifications
            $table->boolean('email_order_updates')->default(true); // 주문/배송 알림
            $table->boolean('email_promotions')->default(true); // 프로모션/할인 알림
            $table->boolean('email_newsletter')->default(false); // 뉴스레터
            $table->boolean('email_product_restock')->default(true); // 재입고 알림

            // SMS notifications
            $table->boolean('sms_order_updates')->default(true); // 주문/배송 알림
            $table->boolean('sms_promotions')->default(false); // 프로모션/할인 알림

            // Push notifications (for mobile app)
            $table->boolean('push_order_updates')->default(true); // 주문/배송 알림
            $table->boolean('push_promotions')->default(false); // 프로모션/할인 알림
            $table->boolean('push_product_restock')->default(true); // 재입고 알림
            $table->boolean('push_review_reminders')->default(true); // 리뷰 작성 알림

            // Marketing consent (법적 요구사항)
            $table->boolean('marketing_email_consent')->default(false);
            $table->boolean('marketing_sms_consent')->default(false);
            $table->timestamp('marketing_consent_date')->nullable();

            // Night time settings
            $table->boolean('do_not_disturb_enabled')->default(false); // 방해 금지 모드
            $table->time('do_not_disturb_start')->default('22:00'); // 시작 시간
            $table->time('do_not_disturb_end')->default('08:00'); // 종료 시간

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_settings');
    }
};
