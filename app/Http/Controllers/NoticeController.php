<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoticeController extends Controller
{
    /**
     * Display notices page
     */
    public function index(Request $request)
    {
        $category = $request->query('category');

        $query = Notice::published()->ordered();

        if ($category && $category !== 'all') {
            $query->byCategory($category);
        }

        $notices = $query->paginate(20)->through(function ($notice) {
            return [
                'id' => $notice->id,
                'category' => $notice->category,
                'title' => $notice->title,
                'isPinned' => $notice->is_pinned,
                'isImportant' => $notice->is_important,
                'viewCount' => $notice->view_count,
                'publishedAt' => $notice->published_at->format('Y-m-d'),
            ];
        });

        // Get categories with counts
        $categories = Notice::published()
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->get()
            ->pluck('count', 'category');

        return Inertia::render('CustomerCenter/Notice', [
            'notices' => $notices,
            'categories' => $categories,
            'selectedCategory' => $category ?? 'all',
        ]);
    }

    /**
     * Display notice detail
     */
    public function show($id)
    {
        $notice = Notice::published()
            ->with('author')
            ->findOrFail($id);

        $notice->incrementViewCount();

        // Get previous and next notices
        $prevNotice = Notice::published()
            ->where('id', '<', $notice->id)
            ->orderBy('id', 'desc')
            ->first();

        $nextNotice = Notice::published()
            ->where('id', '>', $notice->id)
            ->orderBy('id', 'asc')
            ->first();

        return Inertia::render('CustomerCenter/NoticeDetail', [
            'notice' => [
                'id' => $notice->id,
                'category' => $notice->category,
                'title' => $notice->title,
                'content' => $notice->content,
                'attachments' => $notice->attachments,
                'isPinned' => $notice->is_pinned,
                'isImportant' => $notice->is_important,
                'viewCount' => $notice->view_count,
                'publishedAt' => $notice->published_at->format('Y-m-d H:i'),
                'author' => $notice->author->name,
            ],
            'prevNotice' => $prevNotice ? [
                'id' => $prevNotice->id,
                'title' => $prevNotice->title,
            ] : null,
            'nextNotice' => $nextNotice ? [
                'id' => $nextNotice->id,
                'title' => $nextNotice->title,
            ] : null,
        ]);
    }

    /**
     * Search notices
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
        ]);

        $searchQuery = $request->query('query');

        $notices = Notice::published()
            ->where(function ($query) use ($searchQuery) {
                $query->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('content', 'like', "%{$searchQuery}%");
            })
            ->ordered()
            ->paginate(20)
            ->through(function ($notice) {
                return [
                    'id' => $notice->id,
                    'category' => $notice->category,
                    'title' => $notice->title,
                    'publishedAt' => $notice->published_at->format('Y-m-d'),
                ];
            });

        return response()->json(['notices' => $notices]);
    }
}
