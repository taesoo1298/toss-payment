<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'status',
        'customer_name',
        'customer_email',
        'customer_phone',
        'recipient_name',
        'recipient_phone',
        'postal_code',
        'address',
        'address_detail',
        'delivery_memo',
        'subtotal',
        'shipping_cost',
        'coupon_discount',
        'total_amount',
        'coupon_id',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'coupon_discount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'order_id', 'order_id');
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => '주문완료',
            'preparing' => '상품준비중',
            'shipping' => '배송중',
            'delivered' => '배송완료',
            'cancelled' => '취소',
            'refunded' => '환불',
            default => $this->status,
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'blue',
            'preparing' => 'yellow',
            'shipping' => 'purple',
            'delivered' => 'green',
            'cancelled' => 'red',
            'refunded' => 'orange',
            default => 'gray',
        };
    }

    public function canCancel(): bool
    {
        return in_array($this->status, ['pending', 'preparing']);
    }

    public function canRefund(): bool
    {
        return $this->status === 'delivered';
    }
}
