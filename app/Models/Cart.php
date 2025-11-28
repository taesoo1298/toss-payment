<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'coupon_id',
        'total_items',
        'subtotal',
        'discount',
        'total',
        'last_activity_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'last_activity_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    // Helper Methods
    public function isGuest(): bool
    {
        return $this->user_id === null;
    }

    public function isMember(): bool
    {
        return $this->user_id !== null;
    }

    public function recalculateTotals(): void
    {
        $this->total_items = $this->items->sum('quantity');
        $this->subtotal = $this->items->sum('total');

        // Apply coupon discount if exists
        if ($this->coupon) {
            $this->discount = $this->coupon->calculateDiscount($this->subtotal);
        } else {
            $this->discount = 0;
        }

        $this->total = $this->subtotal - $this->discount;
        $this->last_activity_at = now();
        $this->save();
    }

    public function applyCoupon(Coupon $coupon): bool
    {
        if (!$coupon->isValid()) {
            return false;
        }

        $this->coupon_id = $coupon->id;
        $this->recalculateTotals();
        return true;
    }

    public function removeCoupon(): void
    {
        $this->coupon_id = null;
        $this->recalculateTotals();
    }

    public function isEmpty(): bool
    {
        return $this->total_items === 0;
    }

    public function clear(): void
    {
        $this->items()->delete();
        $this->update([
            'total_items' => 0,
            'subtotal' => 0,
            'discount' => 0,
            'total' => 0,
            'coupon_id' => null,
        ]);
    }
}
