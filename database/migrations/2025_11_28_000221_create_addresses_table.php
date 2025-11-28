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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name'); // 배송지명 (우리집, 회사 등)
            $table->string('recipient'); // 받는 사람
            $table->string('phone', 20); // 연락처
            $table->string('postal_code', 10); // 우편번호
            $table->text('address'); // 주소
            $table->string('address_detail')->nullable(); // 상세 주소
            $table->enum('type', ['home', 'office', 'etc'])->default('home'); // 배송지 유형
            $table->boolean('is_default')->default(false); // 기본 배송지 여부
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('is_default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
