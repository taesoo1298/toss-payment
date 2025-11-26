<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'product_id',
        'user_id',
        'order_item_id',
        'rating',
        'content',
        'images',
        'is_verified',
    ];

    protected $casts = [
        'rating' => 'integer',
        'images' => 'array',
        'is_verified' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function getMaskedUserNameAttribute(): string
    {
        $name = $this->user->name;
        if (mb_strlen($name) <= 1) {
            return $name;
        }

        $first = mb_substr($name, 0, 1);
        $last = mb_substr($name, -1);
        $middle = str_repeat('*', mb_strlen($name) - 2);

        return $first . $middle . $last;
    }
}
