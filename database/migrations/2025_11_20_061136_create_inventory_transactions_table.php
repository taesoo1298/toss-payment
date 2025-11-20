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
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['purchase', 'sale', 'return', 'adjustment']);
            $table->integer('quantity')->comment('양수=입고, 음수=출고');
            $table->integer('stock_before')->comment('변경 전 재고');
            $table->integer('stock_after')->comment('변경 후 재고');
            $table->string('reference_type', 50)->nullable()->comment('Order, Return, etc.');
            $table->unsignedBigInteger('reference_id')->nullable()->comment('관련 주문/반품 ID');
            $table->text('note')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->comment('작업자');
            $table->timestamp('created_at')->nullable();

            $table->index('product_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};
