<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['user', 'order', 'transactions']);

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('order_id', 'like', "%{$request->search}%")
                    ->orWhere('payment_key', 'like', "%{$request->search}%")
                    ->orWhere('customer_name', 'like', "%{$request->search}%")
                    ->orWhere('customer_email', 'like', "%{$request->search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment method
        if ($request->filled('method')) {
            $query->where('method', $request->method);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Sort
        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $payments = $query->latest()->paginate(20);

        // Statistics
        $statistics = [
            'total' => Payment::count(),
            'completed' => Payment::completed()->count(),
            'completed_amount' => Payment::completed()->sum('total_amount'),
            'pending' => Payment::pending()->count(),
            'failed' => Payment::failed()->count(),
            'canceled' => Payment::where('status', 'canceled')->count(),
            'canceled_amount' => Payment::where('status', 'canceled')->sum('cancel_amount'),
            'today' => Payment::whereDate('created_at', today())->count(),
            'today_amount' => Payment::whereDate('created_at', today())->completed()->sum('total_amount'),
        ];

        return Inertia::render('Admin/Payments/Index', [
            'payments' => PaymentResource::collection($payments)->additional([
                'meta' => [
                    'current_page' => $payments->currentPage(),
                    'last_page' => $payments->lastPage(),
                    'per_page' => $payments->perPage(),
                    'total' => $payments->total(),
                ],
            ]),
            'filters' => $request->only(['search', 'status', 'method', 'date_from', 'date_to', 'sort', 'direction']),
            'statistics' => $statistics,
        ]);
    }

    public function show(Payment $payment)
    {
        $payment->load(['user', 'order.items', 'transactions']);

        return Inertia::render('Admin/Payments/Show', [
            'payment' => new PaymentResource($payment),
        ]);
    }

    public function cancel(Request $request, Payment $payment)
    {
        $request->validate([
            'cancel_reason' => 'required|string|max:500',
            'cancel_amount' => 'nullable|integer|min:100',
        ]);

        if (!$payment->isCancelable()) {
            return redirect()->back()->with('error', '취소할 수 없는 결제입니다.');
        }

        try {
            // Here you would integrate with TossPaymentService to actually cancel
            // For now, just update the status
            $cancelAmount = $request->input('cancel_amount', $payment->balance_amount);

            if ($cancelAmount > $payment->balance_amount) {
                return redirect()->back()->with('error', '취소 가능 금액을 초과했습니다.');
            }

            $isPartialCancel = $cancelAmount < $payment->total_amount;

            $payment->update([
                'status' => $isPartialCancel ? 'partial_canceled' : 'canceled',
                'cancel_amount' => $payment->cancel_amount + $cancelAmount,
                'balance_amount' => $payment->balance_amount - $cancelAmount,
                'canceled_at' => now(),
            ]);

            // Create transaction record
            $payment->transactions()->create([
                'type' => $isPartialCancel ? 'partial_cancel' : 'cancel',
                'amount' => $cancelAmount,
                'reason' => $request->cancel_reason,
                'processed_at' => now(),
            ]);

            return redirect()->back()->with('success', '결제가 취소되었습니다.');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', '결제 취소 중 오류가 발생했습니다: ' . $e->getMessage());
        }
    }
}
