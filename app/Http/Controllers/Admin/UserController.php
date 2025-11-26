<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = User::withCount('orders');

        // Filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_admin')) {
            $query->where('is_admin', $request->is_admin);
        }

        if ($request->filled('provider')) {
            if ($request->provider === 'email') {
                $query->whereNull('provider');
            } else {
                $query->where('provider', $request->provider);
            }
        }

        if ($request->filled('email_verified')) {
            if ($request->email_verified === '1') {
                $query->whereNotNull('email_verified_at');
            } else {
                $query->whereNull('email_verified_at');
            }
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 20);
        $users = $query->paginate($perPage);

        // Statistics
        $statistics = [
            'total' => User::count(),
            'admins' => User::where('is_admin', true)->count(),
            'verified' => User::whereNotNull('email_verified_at')->count(),
            'social_login' => User::whereNotNull('provider')->count(),
            'email_login' => User::whereNull('provider')->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => UserResource::collection($users)->additional([
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ],
            ]),
            'filters' => $request->only(['search', 'is_admin', 'provider', 'email_verified']),
            'statistics' => $statistics,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        $user->loadCount('orders');
        $user->load(['orders' => function ($query) {
            $query->latest()->limit(10);
        }]);

        return Inertia::render('Admin/Users/Show', [
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'is_admin' => 'sometimes|boolean',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', '회원 정보가 수정되었습니다.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->isAdmin()) {
            return redirect()->back()->with('error', '관리자 계정은 삭제할 수 없습니다.');
        }

        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('success', '회원이 삭제되었습니다.');
    }
}
