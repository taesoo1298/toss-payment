<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    /**
     * Display a listing of the FAQs.
     */
    public function index(Request $request): Response
    {
        $query = Faq::query();

        // Filter by category
        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->is_active === '1');
        }

        // Search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                  ->orWhere('answer', 'like', "%{$search}%");
            });
        }

        $faqs = $query->orderBy('order')->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Admin/Faqs/Index', [
            'faqs' => $faqs,
            'filters' => $request->only(['category', 'is_active', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new FAQ.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Faqs/Create');
    }

    /**
     * Store a newly created FAQ in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:주문/배송,결제,회원,상품,기타',
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Set default order to last
        if (!isset($validated['order'])) {
            $validated['order'] = Faq::max('order') + 1 ?? 0;
        }

        Faq::create($validated);

        return redirect()->route('admin.faqs.index')
            ->with('success', 'FAQ가 등록되었습니다.');
    }

    /**
     * Show the form for editing the specified FAQ.
     */
    public function edit(Faq $faq): Response
    {
        return Inertia::render('Admin/Faqs/Edit', [
            'faq' => $faq,
        ]);
    }

    /**
     * Update the specified FAQ in storage.
     */
    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:주문/배송,결제,회원,상품,기타',
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $faq->update($validated);

        return redirect()->route('admin.faqs.index')
            ->with('success', 'FAQ가 수정되었습니다.');
    }

    /**
     * Remove the specified FAQ from storage.
     */
    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();

        return redirect()->route('admin.faqs.index')
            ->with('success', 'FAQ가 삭제되었습니다.');
    }
}
