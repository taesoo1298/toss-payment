<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'transaction_key',
        'type',
        'amount',
        'reason',
        'raw_data',
        'processed_at',
    ];

    protected $casts = [
        'amount' => 'integer',
        'raw_data' => 'array',
        'processed_at' => 'datetime',
    ];

    const TYPE_PAYMENT = 'payment';
    const TYPE_CANCEL = 'cancel';
    const TYPE_PARTIAL_CANCEL = 'partial_cancel';

    /**
     * Get the payment that owns the transaction.
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * Scope a query to only include payment transactions.
     */
    public function scopePayments($query)
    {
        return $query->where('type', self::TYPE_PAYMENT);
    }

    /**
     * Scope a query to only include cancel transactions.
     */
    public function scopeCancels($query)
    {
        return $query->whereIn('type', [self::TYPE_CANCEL, self::TYPE_PARTIAL_CANCEL]);
    }
}
