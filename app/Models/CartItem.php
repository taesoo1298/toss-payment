<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'price',
        'discount',
        'total',
        'options',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'options' => 'array',
    ];

    // Relationships
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Helper Methods
    public function updateQuantity(int $quantity): bool
    {
        if ($quantity < 1) {
            return false;
        }

        // Check stock availability
        if ($quantity > $this->product->stock) {
            return false;
        }

        $this->quantity = $quantity;
        $this->recalculateTotal();
        $this->cart->recalculateTotals();
        return true;
    }

    public function recalculateTotal(): void
    {
        $this->total = ($this->price - $this->discount) * $this->quantity;
        $this->save();
    }

    public function isInStock(): bool
    {
        return $this->product->stock >= $this->quantity;
    }
}
