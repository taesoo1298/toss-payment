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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_id', 50)->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'preparing', 'shipping', 'delivered', 'cancelled', 'refunded'])->default('pending');

            // Customer Info
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone', 20);

            // Shipping Info
            $table->string('recipient_name');
            $table->string('recipient_phone', 20);
            $table->string('postal_code', 10);
            $table->text('address');
            $table->string('address_detail')->nullable();
            $table->text('delivery_memo')->nullable();

            // Pricing
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('coupon_discount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);

            // Coupon (foreign key will be added when coupons table is created)
            $table->unsignedBigInteger('coupon_id')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('order_id');
            $table->index('user_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
