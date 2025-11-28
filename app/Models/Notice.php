<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notice extends Model
{
    protected $fillable = [
        'category',
        'title',
        'content',
        'attachments',
        'is_pinned',
        'is_important',
        'view_count',
        'published_at',
        'author_id',
    ];

    protected $casts = [
        'attachments' => 'array',
        'is_pinned' => 'boolean',
        'is_important' => 'boolean',
        'view_count' => 'integer',
        'published_at' => 'datetime',
    ];

    /**
     * Get the author of the notice
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Increment view count
     */
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    /**
     * Check if notice is published
     */
    public function isPublished(): bool
    {
        return $this->published_at && $this->published_at->isPast();
    }

    /**
     * Scope: Published notices only
     */
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope: Pinned notices
     */
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    /**
     * Scope: Important notices
     */
    public function scopeImportant($query)
    {
        return $query->where('is_important', true);
    }

    /**
     * Scope: By category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope: Ordered (pinned first, then by date)
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc');
    }
}
