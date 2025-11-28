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
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Payment method type: card, bank, easy_pay (토스페이, 카카오페이, etc.)
            $table->enum('type', ['card', 'bank', 'easy_pay'])->default('card');

            // For cards
            $table->string('card_company')->nullable(); // 카드사 (현대, 신한, etc.)
            $table->string('card_number_masked')->nullable(); // 1234-****-****-5678
            $table->string('card_nickname')->nullable(); // 사용자 지정 별칭

            // For bank accounts
            $table->string('bank_name')->nullable(); // 은행명
            $table->string('account_number_masked')->nullable(); // 123-***-456
            $table->string('account_holder')->nullable(); // 예금주

            // For easy pay
            $table->string('easy_pay_provider')->nullable(); // TOSSPAY, KAKAOPAY, NAVERPAY, etc.

            // Toss Payments billing key for auto payment
            $table->string('billing_key')->nullable();
            $table->timestamp('billing_key_expires_at')->nullable();

            // Settings
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('is_default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
