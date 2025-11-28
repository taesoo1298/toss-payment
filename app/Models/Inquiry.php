<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inquiry extends Model
{
    protected $fillable = [
        'user_id',
        'order_id',
        'category',
        'subject',
        'content',
        'attachments',
        'status',
        'answer',
        'answered_at',
        'answered_by',
    ];

    protected $casts = [
        'attachments' => 'array',
        'answered_at' => 'datetime',
    ];

    /**
     * Get the user who created the inquiry
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the related order (if any)
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the admin who answered
     */
    public function answeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'answered_by');
    }

    /**
     * Mark inquiry as answered
     */
    public function markAnswered(string $answer, int $adminId): void
    {
        $this->update([
            'status' => 'answered',
            'answer' => $answer,
            'answered_at' => now(),
            'answered_by' => $adminId,
        ]);
    }

    /**
     * Close the inquiry
     */
    public function close(): void
    {
        $this->update(['status' => 'closed']);
    }

    /**
     * Scope: Pending inquiries
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: Answered inquiries
     */
    public function scopeAnswered($query)
    {
        return $query->where('status', 'answered');
    }

    /**
     * Scope: By category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
