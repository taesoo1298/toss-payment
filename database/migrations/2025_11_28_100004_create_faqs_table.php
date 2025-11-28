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
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // 주문/배송, 결제, 회원, 상품, 기타
            $table->string('question');
            $table->text('answer');
            $table->integer('view_count')->default(0);
            $table->integer('helpful_count')->default(0); // 도움됨 카운트
            $table->integer('order')->default(0); // 정렬 순서
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('category');
            $table->index('is_active');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
