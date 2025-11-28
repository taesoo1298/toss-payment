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
        Schema::create('notices', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // 공지, 이벤트, 업데이트, 점검
            $table->string('title');
            $table->text('content');
            $table->json('attachments')->nullable(); // 첨부파일 URLs
            $table->boolean('is_pinned')->default(false); // 상단 고정
            $table->boolean('is_important')->default(false); // 중요 공지
            $table->integer('view_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index('category');
            $table->index('is_pinned');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notices');
    }
};
