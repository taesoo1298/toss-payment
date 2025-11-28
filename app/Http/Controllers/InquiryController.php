<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InquiryController extends Controller
{
    /**
     * Display user's inquiries page
     */
    public function index(Request $request)
    {
        $status = $request->query('status');

        $query = Inquiry::where('user_id', $request->user()->id)
            ->with(['order'])
            ->orderBy('created_at', 'desc');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $inquiries = $query->get()->map(function ($inquiry) {
            return [
                'id' => $inquiry->id,
                'category' => $inquiry->category,
                'subject' => $inquiry->subject,
                'status' => $inquiry->status,
                'orderId' => $inquiry->order?->order_id,
                'createdAt' => $inquiry->created_at->format('Y-m-d H:i'),
                'answeredAt' => $inquiry->answered_at?->format('Y-m-d H:i'),
                'hasAnswer' => $inquiry->status === 'answered',
            ];
        });

        return Inertia::render('CustomerCenter/Inquiry', [
            'inquiries' => $inquiries,
            'selectedStatus' => $status ?? 'all',
        ]);
    }

    /**
     * Display inquiry create page
     */
    public function create(Request $request)
    {
        return Inertia::render('CustomerCenter/InquiryCreate', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Display inquiry detail
     */
    public function show(Request $request, $id)
    {
        $inquiry = Inquiry::where('user_id', $request->user()->id)
            ->with(['order', 'answeredBy'])
            ->findOrFail($id);

        return Inertia::render('CustomerCenter/InquiryDetail', [
            'inquiry' => [
                'id' => $inquiry->id,
                'category' => $inquiry->category,
                'subject' => $inquiry->subject,
                'content' => $inquiry->content,
                'attachments' => $inquiry->attachments,
                'status' => $inquiry->status,
                'orderId' => $inquiry->order?->order_id,
                'createdAt' => $inquiry->created_at->format('Y-m-d H:i:s'),
                'answer' => $inquiry->answer,
                'answeredAt' => $inquiry->answered_at?->format('Y-m-d H:i:s'),
                'answeredBy' => $inquiry->answeredBy?->name,
            ],
        ]);
    }

    /**
     * Create new inquiry
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:50',
            'subject' => 'required|string|max:200',
            'content' => 'required|string',
            'order_id' => 'nullable|exists:orders,id',
            'attachments' => 'nullable|array',
            'attachments.*' => 'url',
        ]);

        $validated['user_id'] = $request->user()->id;

        $inquiry = Inquiry::create($validated);

        return response()->json([
            'message' => '문의가 등록되었습니다.',
            'inquiry' => [
                'id' => $inquiry->id,
                'subject' => $inquiry->subject,
            ],
        ], 201);
    }

    /**
     * Update inquiry (only if not answered yet)
     */
    public function update(Request $request, $id)
    {
        $inquiry = Inquiry::where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->findOrFail($id);

        $validated = $request->validate([
            'subject' => 'sometimes|string|max:200',
            'content' => 'sometimes|string',
            'attachments' => 'nullable|array',
        ]);

        $inquiry->update($validated);

        return response()->json([
            'message' => '문의가 수정되었습니다.',
        ]);
    }

    /**
     * Delete inquiry (only if not answered yet)
     */
    public function destroy(Request $request, $id)
    {
        $inquiry = Inquiry::where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->findOrFail($id);

        $inquiry->delete();

        return response()->json([
            'message' => '문의가 삭제되었습니다.',
        ]);
    }

    /**
     * Close inquiry
     */
    public function close(Request $request, $id)
    {
        $inquiry = Inquiry::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $inquiry->close();

        return response()->json([
            'message' => '문의가 종료되었습니다.',
        ]);
    }
}
