<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NoticeController extends Controller
{
    /**
     * Display a listing of the notices.
     */
    public function index(Request $request): Response
    {
        $query = Notice::with('author');

        // Filter by category
        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }

        // Filter by pinned
        if ($request->has('is_pinned') && $request->is_pinned !== '') {
            $query->where('is_pinned', $request->is_pinned === '1');
        }

        // Search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $notices = $query->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->paginate(20)
            ->through(function ($notice) {
                return [
                    'id' => $notice->id,
                    'category' => $notice->category,
                    'title' => $notice->title,
                    'author_name' => $notice->author?->name,
                    'view_count' => $notice->view_count,
                    'is_pinned' => $notice->is_pinned,
                    'is_important' => $notice->is_important,
                    'published_at' => $notice->published_at?->format('Y-m-d H:i'),
                    'created_at' => $notice->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('Admin/Notices/Index', [
            'notices' => $notices,
            'filters' => $request->only(['category', 'is_pinned', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new notice.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Notices/Create');
    }

    /**
     * Store a newly created notice in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:공지,이벤트,업데이트,점검',
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'is_pinned' => 'boolean',
            'is_important' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['author_id'] = auth()->id();

        // Set published_at to now if not provided
        if (!isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        Notice::create($validated);

        return redirect()->route('admin.notices.index')
            ->with('success', '공지사항이 등록되었습니다.');
    }

    /**
     * Show the form for editing the specified notice.
     */
    public function edit(Notice $notice): Response
    {
        return Inertia::render('Admin/Notices/Edit', [
            'notice' => [
                'id' => $notice->id,
                'category' => $notice->category,
                'title' => $notice->title,
                'content' => $notice->content,
                'is_pinned' => $notice->is_pinned,
                'is_important' => $notice->is_important,
                'published_at' => $notice->published_at?->format('Y-m-d\TH:i'),
            ],
        ]);
    }

    /**
     * Update the specified notice in storage.
     */
    public function update(Request $request, Notice $notice): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:공지,이벤트,업데이트,점검',
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'is_pinned' => 'boolean',
            'is_important' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $notice->update($validated);

        return redirect()->route('admin.notices.index')
            ->with('success', '공지사항이 수정되었습니다.');
    }

    /**
     * Remove the specified notice from storage.
     */
    public function destroy(Notice $notice): RedirectResponse
    {
        $notice->delete();

        return redirect()->route('admin.notices.index')
            ->with('success', '공지사항이 삭제되었습니다.');
    }
}
