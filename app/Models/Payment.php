<?php

namespace App\Models;

use App\Enums\Payment\PaymentMethod;
use App\Enums\Payment\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'order_id',
        'payment_key',
        'order_name',
        'customer_name',
        'customer_email',
        'customer_mobile_phone',
        'method',
        'status',
        'requested_at',
        'approved_at',
        'canceled_at',
        'total_amount',
        'balance_amount',
        'supplied_amount',
        'vat',
        'tax_free_amount',
        'discount_amount',
        'cancel_amount',
        'currency',
        'country',
        'card_company',
        'card_number',
        'card_type',
        'receipt_url',
        'checkout_url',
        'failure_code',
        'failure_message',
        'metadata',
    ];

    protected $casts = [
        'method' => PaymentMethod::class,
        'status' => PaymentStatus::class,
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'canceled_at' => 'datetime',
        'total_amount' => 'integer',
        'balance_amount' => 'integer',
        'supplied_amount' => 'integer',
        'vat' => 'integer',
        'tax_free_amount' => 'integer',
        'discount_amount' => 'integer',
        'cancel_amount' => 'integer',
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns the payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transactions for the payment.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    /**
     * Scope a query to only include completed payments.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', PaymentStatus::DONE);
    }

    /**
     * Scope a query to only include pending payments.
     */
    public function scopePending($query)
    {
        return $query->whereIn('status', [
            PaymentStatus::PENDING,
            PaymentStatus::READY,
            PaymentStatus::IN_PROGRESS,
        ]);
    }

    /**
     * Scope a query to only include failed payments.
     */
    public function scopeFailed($query)
    {
        return $query->whereIn('status', [
            PaymentStatus::ABORTED,
            PaymentStatus::EXPIRED,
        ]);
    }

    /**
     * Check if payment is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status->isCompleted();
    }

    /**
     * Check if payment is cancelable.
     */
    public function isCancelable(): bool
    {
        return $this->status->isCompleted() && $this->balance_amount > 0;
    }

    /**
     * Check if payment is failed.
     */
    public function isFailed(): bool
    {
        return $this->status->isFailed();
    }

    /**
     * Get remaining cancelable amount.
     */
    public function getCancelableAmount(): int
    {
        return $this->balance_amount;
    }

    /**
     * Calculate refund amount after fees.
     */
    public function calculateRefundAmount(int $cancelAmount): int
    {
        // 토스페이먼츠 수수료 계산 로직 (필요시 구현)
        return $cancelAmount;
    }
}
