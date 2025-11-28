<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    /**
     * Display a listing of the inquiries.
     */
    public function index(Request $request): Response
    {
        $query = Inquiry::with('user', 'order');

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }

        // Search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $inquiries = $query->latest()
            ->paginate(20)
            ->through(function ($inquiry) {
                return [
                    'id' => $inquiry->id,
                    'user_name' => $inquiry->user->name,
                    'user_email' => $inquiry->user->email,
                    'category' => $inquiry->category,
                    'subject' => $inquiry->subject,
                    'status' => $inquiry->status,
                    'order_id' => $inquiry->order_id,
                    'created_at' => $inquiry->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries,
            'filters' => $request->only(['status', 'category', 'search']),
        ]);
    }

    /**
     * Display the specified inquiry.
     */
    public function show(Inquiry $inquiry): Response
    {
        $inquiry->load('user', 'order', 'answeredBy');

        return Inertia::render('Admin/Inquiries/Show', [
            'inquiry' => [
                'id' => $inquiry->id,
                'user_name' => $inquiry->user->name,
                'user_email' => $inquiry->user->email,
                'category' => $inquiry->category,
                'subject' => $inquiry->subject,
                'content' => $inquiry->content,
                'attachments' => $inquiry->attachments,
                'status' => $inquiry->status,
                'order_id' => $inquiry->order_id,
                'answer' => $inquiry->answer,
                'answered_at' => $inquiry->answered_at?->format('Y-m-d H:i'),
                'answered_by_name' => $inquiry->answeredBy?->name,
                'created_at' => $inquiry->created_at->format('Y-m-d H:i'),
            ],
        ]);
    }

    /**
     * Answer the specified inquiry.
     */
    public function answer(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $validated = $request->validate([
            'answer' => 'required|string',
        ]);

        $inquiry->markAnswered($validated['answer'], auth()->id());

        return redirect()->route('admin.inquiries.show', $inquiry)
            ->with('success', '답변이 등록되었습니다.');
    }

    /**
     * Remove the specified inquiry from storage.
     */
    public function destroy(Inquiry $inquiry): RedirectResponse
    {
        $inquiry->delete();

        return redirect()->route('admin.inquiries.index')
            ->with('success', '문의가 삭제되었습니다.');
    }
}
