<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentMethod extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'type',
        'card_company',
        'card_number_masked',
        'card_nickname',
        'bank_name',
        'account_number_masked',
        'account_holder',
        'easy_pay_provider',
        'billing_key',
        'billing_key_expires_at',
        'is_default',
        'is_active',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'billing_key_expires_at' => 'datetime',
    ];

    protected $hidden = [
        'billing_key', // Security: don't expose billing key in API responses
    ];

    /**
     * Get the user that owns the payment method
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Set this payment method as default
     */
    public function setAsDefault(): void
    {
        // Remove default flag from all other payment methods
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }

    /**
     * Get display name for the payment method
     */
    public function getDisplayNameAttribute(): string
    {
        return match ($this->type) {
            'card' => $this->card_nickname ?? "{$this->card_company} {$this->card_number_masked}",
            'bank' => "{$this->bank_name} {$this->account_number_masked}",
            'easy_pay' => $this->easy_pay_provider,
            default => '알 수 없음',
        };
    }

    /**
     * Check if billing key is expired
     */
    public function isBillingKeyExpired(): bool
    {
        if (!$this->billing_key_expires_at) {
            return false;
        }

        return $this->billing_key_expires_at->isPast();
    }
}
