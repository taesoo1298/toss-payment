<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ReviewResource;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Review::with(['product', 'user']);

        // Filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('content', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('product', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('is_verified')) {
            $query->where('is_verified', $request->is_verified);
        }

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 20);
        $reviews = $query->paginate($perPage);

        // Statistics
        $statistics = [
            'total' => Review::count(),
            'verified' => Review::where('is_verified', true)->count(),
            'unverified' => Review::where('is_verified', false)->count(),
            'average_rating' => round(Review::avg('rating'), 1),
            'rating_5' => Review::where('rating', 5)->count(),
            'rating_4' => Review::where('rating', 4)->count(),
            'rating_3' => Review::where('rating', 3)->count(),
            'rating_2' => Review::where('rating', 2)->count(),
            'rating_1' => Review::where('rating', 1)->count(),
        ];

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => ReviewResource::collection($reviews)->additional([
                'meta' => [
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage(),
                    'per_page' => $reviews->perPage(),
                    'total' => $reviews->total(),
                ],
            ]),
            'filters' => $request->only(['search', 'rating', 'is_verified', 'product_id']),
            'statistics' => $statistics,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->back()->with('success', '리뷰가 삭제되었습니다.');
    }

    /**
     * Approve a review.
     */
    public function approve(Review $review)
    {
        $review->update(['is_verified' => true]);

        return redirect()->back()->with('success', '리뷰가 승인되었습니다.');
    }
}
