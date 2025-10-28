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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('order_id')->unique()->index();
            $table->string('payment_key')->nullable()->unique()->index();

            // 주문 정보
            $table->string('order_name');
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_mobile_phone')->nullable();

            // 결제 정보
            $table->string('method')->index();
            $table->string('status')->default('pending')->index();
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('approved_at')->nullable()->index();
            $table->timestamp('canceled_at')->nullable();

            // 금액 정보
            $table->unsignedBigInteger('total_amount')->default(0);
            $table->unsignedBigInteger('balance_amount')->default(0);
            $table->unsignedBigInteger('supplied_amount')->default(0);
            $table->unsignedBigInteger('vat')->default(0);
            $table->unsignedBigInteger('tax_free_amount')->default(0);
            $table->unsignedBigInteger('discount_amount')->default(0);
            $table->unsignedBigInteger('cancel_amount')->default(0);

            // 부가 정보
            $table->string('currency', 3)->default('KRW');
            $table->string('country', 2)->default('KR');

            // 카드 정보 (카드 결제시)
            $table->string('card_company')->nullable();
            $table->string('card_number')->nullable();
            $table->string('card_type')->nullable();

            // URL 정보
            $table->text('receipt_url')->nullable();
            $table->text('checkout_url')->nullable();

            // 실패 정보
            $table->string('failure_code')->nullable();
            $table->text('failure_message')->nullable();

            // 메타데이터
            $table->json('metadata')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // 인덱스
            $table->index(['user_id', 'status']);
            $table->index(['created_at', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
