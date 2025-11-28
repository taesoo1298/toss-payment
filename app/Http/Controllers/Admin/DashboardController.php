<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Inquiry;
use App\Models\Faq;
use App\Models\Notice;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display admin dashboard
     */
    public function index(): Response
    {
        // Calculate statistics
        $stats = [
            'total_users' => User::count(),
            'total_orders' => Order::count(),
            'pending_inquiries' => Inquiry::where('status', 'pending')->count(),
            'total_faqs' => Faq::where('is_active', true)->count(),
            'total_notices' => Notice::where('published_at', '<=', now())->count(),
        ];

        // Recent orders (last 5)
        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_name' => $order->user->name ?? '비회원',
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('Y-m-d H:i'),
                ];
            });

        // Pending inquiries (last 5)
        $pendingInquiries = Inquiry::with('user')
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($inquiry) {
                return [
                    'id' => $inquiry->id,
                    'user_name' => $inquiry->user->name,
                    'category' => $inquiry->category,
                    'subject' => $inquiry->subject,
                    'created_at' => $inquiry->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'pendingInquiries' => $pendingInquiries,
        ]);
    }
}
