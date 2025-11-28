<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationSetting extends Model
{
    protected $fillable = [
        'user_id',
        'email_order_updates',
        'email_promotions',
        'email_newsletter',
        'email_product_restock',
        'sms_order_updates',
        'sms_promotions',
        'push_order_updates',
        'push_promotions',
        'push_product_restock',
        'push_review_reminders',
        'marketing_email_consent',
        'marketing_sms_consent',
        'marketing_consent_date',
        'do_not_disturb_enabled',
        'do_not_disturb_start',
        'do_not_disturb_end',
    ];

    protected $casts = [
        'email_order_updates' => 'boolean',
        'email_promotions' => 'boolean',
        'email_newsletter' => 'boolean',
        'email_product_restock' => 'boolean',
        'sms_order_updates' => 'boolean',
        'sms_promotions' => 'boolean',
        'push_order_updates' => 'boolean',
        'push_promotions' => 'boolean',
        'push_product_restock' => 'boolean',
        'push_review_reminders' => 'boolean',
        'marketing_email_consent' => 'boolean',
        'marketing_sms_consent' => 'boolean',
        'marketing_consent_date' => 'datetime',
        'do_not_disturb_enabled' => 'boolean',
    ];

    /**
     * Get the user that owns the notification settings
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Update marketing consent
     */
    public function updateMarketingConsent(bool $emailConsent, bool $smsConsent): void
    {
        $this->update([
            'marketing_email_consent' => $emailConsent,
            'marketing_sms_consent' => $smsConsent,
            'marketing_consent_date' => now(),
        ]);
    }

    /**
     * Check if user can receive notifications at current time
     */
    public function canReceiveNotification(): bool
    {
        if (!$this->do_not_disturb_enabled) {
            return true;
        }

        $now = now()->format('H:i:s');
        $start = $this->do_not_disturb_start;
        $end = $this->do_not_disturb_end;

        // Handle cases where DND spans midnight
        if ($start > $end) {
            return !($now >= $start || $now <= $end);
        }

        return !($now >= $start && $now <= $end);
    }
}
