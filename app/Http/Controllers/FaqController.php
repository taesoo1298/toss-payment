<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    /**
     * Display FAQ page
     */
    public function index(Request $request)
    {
        $category = $request->query('category');

        $query = Faq::active()->ordered();

        if ($category && $category !== 'all') {
            $query->byCategory($category);
        }

        $faqs = $query->get()->map(function ($faq) {
            return [
                'id' => $faq->id,
                'category' => $faq->category,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'viewCount' => $faq->view_count,
                'helpfulCount' => $faq->helpful_count,
            ];
        });

        // Get categories with counts
        $categories = Faq::active()
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->get()
            ->pluck('count', 'category');

        return Inertia::render('CustomerCenter/Faq', [
            'faqs' => $faqs,
            'categories' => $categories,
            'selectedCategory' => $category ?? 'all',
        ]);
    }

    /**
     * Get FAQ by ID
     */
    public function show($id)
    {
        $faq = Faq::active()->findOrFail($id);

        $faq->incrementViewCount();

        return response()->json([
            'faq' => [
                'id' => $faq->id,
                'category' => $faq->category,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'viewCount' => $faq->view_count,
                'helpfulCount' => $faq->helpful_count,
            ],
        ]);
    }

    /**
     * Mark FAQ as helpful
     */
    public function markHelpful($id)
    {
        $faq = Faq::active()->findOrFail($id);

        $faq->markHelpful();

        return response()->json([
            'message' => '도움이 되었다는 의견이 반영되었습니다.',
            'helpfulCount' => $faq->helpful_count,
        ]);
    }

    /**
     * Search FAQs
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
        ]);

        $searchQuery = $request->query('query');

        $faqs = Faq::active()
            ->where(function ($query) use ($searchQuery) {
                $query->where('question', 'like', "%{$searchQuery}%")
                    ->orWhere('answer', 'like', "%{$searchQuery}%");
            })
            ->ordered()
            ->get()
            ->map(function ($faq) {
                return [
                    'id' => $faq->id,
                    'category' => $faq->category,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                ];
            });

        return response()->json(['faqs' => $faqs]);
    }
}
