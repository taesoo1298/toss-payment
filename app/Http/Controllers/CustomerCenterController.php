<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\Inquiry;
use App\Models\Notice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerCenterController extends Controller
{
    /**
     * Display customer center main page
     */
    public function index(Request $request)
    {
        // Get recent notices (top 5)
        $recentNotices = Notice::published()
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($notice) {
                return [
                    'id' => $notice->id,
                    'title' => $notice->title,
                    'category' => $notice->category,
                    'isPinned' => $notice->is_pinned,
                    'isImportant' => $notice->is_important,
                    'publishedAt' => $notice->published_at->format('Y-m-d'),
                ];
            });

        // Get popular FAQs (top 5 by view count)
        $popularFaqs = Faq::active()
            ->orderBy('view_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($faq) {
                return [
                    'id' => $faq->id,
                    'category' => $faq->category,
                    'question' => $faq->question,
                    'viewCount' => $faq->view_count,
                ];
            });

        // Get user's recent inquiries if authenticated
        $recentInquiries = null;
        if ($request->user()) {
            $recentInquiries = Inquiry::where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get()
                ->map(function ($inquiry) {
                    return [
                        'id' => $inquiry->id,
                        'subject' => $inquiry->subject,
                        'category' => $inquiry->category,
                        'status' => $inquiry->status,
                        'createdAt' => $inquiry->created_at->format('Y-m-d'),
                    ];
                });
        }

        // FAQ categories count
        $faqCategories = [
            ['name' => '주문/배송', 'slug' => 'order', 'count' => Faq::active()->where('category', '주문/배송')->count()],
            ['name' => '결제', 'slug' => 'payment', 'count' => Faq::active()->where('category', '결제')->count()],
            ['name' => '회원', 'slug' => 'account', 'count' => Faq::active()->where('category', '회원')->count()],
            ['name' => '상품', 'slug' => 'product', 'count' => Faq::active()->where('category', '상품')->count()],
            ['name' => '기타', 'slug' => 'etc', 'count' => Faq::active()->where('category', '기타')->count()],
        ];

        return Inertia::render('CustomerCenter/Index', [
            'recentNotices' => $recentNotices,
            'popularFaqs' => $popularFaqs,
            'recentInquiries' => $recentInquiries,
            'faqCategories' => $faqCategories,
        ]);
    }
}
