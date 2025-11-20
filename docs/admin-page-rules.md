# 🛡️ Dr.Smile Admin Page Development Rules

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Directory Structure](#directory-structure)
4. [Routing Rules](#routing-rules)
5. [Authentication & Authorization](#authentication--authorization)
6. [Backend Development Rules](#backend-development-rules)
7. [Frontend Development Rules](#frontend-development-rules)
8. [UI/UX Guidelines](#uiux-guidelines)
9. [Naming Conventions](#naming-conventions)
10. [Security Guidelines](#security-guidelines)
11. [Best Practices Checklist](#best-practices-checklist)

---

## Overview

### Purpose
This document defines the standardized rules and guidelines for developing admin pages in the Dr.Smile e-commerce platform.

### Technology Stack
- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 + TypeScript (Inertia.js)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Authentication**: Laravel Sanctum
- **Build Tool**: Vite 7

### Design Philosophy
- **Consistency**: Follow existing project patterns from Payment module
- **Security First**: Admin features require strict authorization
- **Maintainability**: Clear separation of concerns
- **Type Safety**: Leverage TypeScript for all admin components

---

## Architecture Principles

### 1. Separation of Concerns

```
┌─────────────────────────────────────────────┐
│           Admin Frontend Layer              │
│  resources/js/Pages/Admin/**               │
└───────────────────┬─────────────────────────┘
                    │ Inertia Requests
┌───────────────────┴─────────────────────────┐
│         Admin Controller Layer              │
│  app/Http/Controllers/Admin/**             │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────┴─────────────────────────┐
│          Admin Service Layer                │
│  app/Services/Admin/**                     │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────┴─────────────────────────┐
│        Repository Layer                     │
│  app/Repositories/**                       │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────┴─────────────────────────┐
│            Model Layer                      │
│  app/Models/**                             │
└─────────────────────────────────────────────┘
```

### 2. Admin-Specific Patterns

**Use Case Segregation**:
- Admin controllers should be separate from user-facing controllers
- Admin routes must be prefixed with `/admin`
- Admin pages should use dedicated layout (`AdminLayout.tsx`)

**Authorization Layers**:
```
Route Middleware → Policy Check → Service Layer Validation
```

---

## Directory Structure

### Backend Files

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Admin/
│   │       ├── DashboardController.php
│   │       ├── ProductController.php
│   │       ├── OrderController.php
│   │       ├── UserController.php
│   │       ├── CouponController.php
│   │       └── ReviewController.php
│   │
│   ├── Requests/
│   │   └── Admin/
│   │       ├── Product/
│   │       │   ├── StoreProductRequest.php
│   │       │   └── UpdateProductRequest.php
│   │       ├── Coupon/
│   │       │   ├── StoreCouponRequest.php
│   │       │   └── UpdateCouponRequest.php
│   │       └── ... (other resources)
│   │
│   ├── Resources/
│   │   └── Admin/
│   │       ├── ProductResource.php
│   │       ├── OrderResource.php
│   │       ├── UserResource.php
│   │       └── ... (other resources)
│   │
│   └── Middleware/
│       └── IsAdmin.php
│
├── Services/
│   └── Admin/
│       ├── ProductService.php
│       ├── OrderService.php
│       ├── CouponService.php
│       └── AnalyticsService.php
│
└── Policies/
    ├── ProductPolicy.php
    ├── OrderPolicy.php
    └── UserPolicy.php
```

### Frontend Files

```
resources/js/
├── Pages/
│   └── Admin/
│       ├── Dashboard.tsx           # Admin 대시보드
│       ├── Products/
│       │   ├── Index.tsx          # 상품 목록
│       │   ├── Create.tsx         # 상품 등록
│       │   └── Edit.tsx           # 상품 수정
│       ├── Orders/
│       │   ├── Index.tsx          # 주문 목록
│       │   └── Detail.tsx         # 주문 상세
│       ├── Users/
│       │   ├── Index.tsx          # 회원 목록
│       │   └── Detail.tsx         # 회원 상세
│       ├── Coupons/
│       │   ├── Index.tsx          # 쿠폰 목록
│       │   ├── Create.tsx         # 쿠폰 등록
│       │   └── Edit.tsx           # 쿠폰 수정
│       ├── Reviews/
│       │   └── Index.tsx          # 리뷰 관리
│       └── Settings/
│           └── Index.tsx          # 시스템 설정
│
├── Layouts/
│   └── AdminLayout.tsx            # Admin 전용 레이아웃
│
└── Components/
    └── Admin/
        ├── Sidebar.tsx            # Admin 사이드바
        ├── Header.tsx             # Admin 헤더
        ├── StatsCard.tsx          # 통계 카드
        ├── DataTable.tsx          # 데이터 테이블
        └── ... (other admin components)
```

---

## Routing Rules

### 1. Route Naming Convention

```php
// routes/admin.php

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Products
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/create', [ProductController::class, 'create'])->name('create');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::get('/{product}', [ProductController::class, 'show'])->name('show');
        Route::get('/{product}/edit', [ProductController::class, 'edit'])->name('edit');
        Route::put('/{product}', [ProductController::class, 'update'])->name('update');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('destroy');
    });

    // Orders
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::get('/{order}', [OrderController::class, 'show'])->name('show');
        Route::patch('/{order}/status', [OrderController::class, 'updateStatus'])->name('update-status');
        Route::post('/{order}/cancel', [OrderController::class, 'cancel'])->name('cancel');
    });

    // Users
    Route::resource('users', UserController::class)->except(['create', 'store']);

    // Coupons
    Route::resource('coupons', CouponController::class);

    // Reviews
    Route::prefix('reviews')->name('reviews.')->group(function () {
        Route::get('/', [ReviewController::class, 'index'])->name('index');
        Route::patch('/{review}/approve', [ReviewController::class, 'approve'])->name('approve');
        Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('destroy');
    });
});
```

### 2. Route Middleware Stack

**Required Middleware Order**:
```php
['web', 'auth', 'admin', 'verified']
```

**Explanation**:
- `web`: Session, CSRF protection
- `auth`: User authentication
- `admin`: Admin role check
- `verified`: Email verification (optional)

---

## Authentication & Authorization

### 1. Admin Role Check Middleware

```php
// app/Http/Middleware/IsAdmin.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()?->is_admin) {
            abort(403, 'Unauthorized access to admin area.');
        }

        return $next($request);
    }
}
```

**Register in `bootstrap/app.php`**:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\IsAdmin::class,
    ]);
})
```

### 2. User Model Update

```php
// app/Models/User.php

protected $fillable = [
    'name',
    'email',
    'password',
    'is_admin', // Add this
];

protected $casts = [
    'email_verified_at' => 'datetime',
    'password' => 'hashed',
    'is_admin' => 'boolean', // Add this
];

public function isAdmin(): bool
{
    return $this->is_admin === true;
}
```

### 3. Migration for Admin Role

```php
// database/migrations/xxxx_add_is_admin_to_users_table.php

Schema::table('users', function (Blueprint $table) {
    $table->boolean('is_admin')->default(false)->after('email_verified_at');
});
```

### 4. Policy-Based Authorization

```php
// app/Policies/ProductPolicy.php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;

class ProductPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Product $product): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->isAdmin();
    }
}
```

**Register in `AppServiceProvider`**:
```php
use App\Models\Product;
use App\Policies\ProductPolicy;
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::policy(Product::class, ProductPolicy::class);
}
```

---

## Backend Development Rules

### 1. Controller Pattern

**Standard Admin Controller Structure**:

```php
// app/Http/Controllers/Admin/ProductController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\StoreProductRequest;
use App\Http\Requests\Admin\Product\UpdateProductRequest;
use App\Http\Resources\Admin\ProductResource;
use App\Models\Product;
use App\Services\Admin\ProductService;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {
        $this->authorizeResource(Product::class, 'product');
    }

    public function index(): Response
    {
        $products = $this->productService->getPaginatedProducts(
            request()->all()
        );

        return Inertia::render('Admin/Products/Index', [
            'products' => ProductResource::collection($products),
            'filters' => request()->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => config('products.categories'),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $product = $this->productService->createProduct($request->validated());

        return redirect()
            ->route('admin.products.index')
            ->with('success', '상품이 등록되었습니다.');
    }

    public function show(Product $product): Response
    {
        return Inertia::render('Admin/Products/Show', [
            'product' => new ProductResource($product->load('reviews')),
        ]);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => new ProductResource($product),
            'categories' => config('products.categories'),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->productService->updateProduct($product, $request->validated());

        return redirect()
            ->route('admin.products.index')
            ->with('success', '상품이 수정되었습니다.');
    }

    public function destroy(Product $product)
    {
        $this->productService->deleteProduct($product);

        return redirect()
            ->route('admin.products.index')
            ->with('success', '상품이 삭제되었습니다.');
    }
}
```

**Key Rules**:
- ✅ Use dependency injection for services
- ✅ Use `authorizeResource()` for automatic policy checks
- ✅ Use Form Requests for validation
- ✅ Use API Resources for response formatting
- ✅ Delegate business logic to Service layer
- ✅ Return Inertia responses for pages
- ✅ Use flash messages for user feedback
- ❌ Do NOT put business logic in controllers
- ❌ Do NOT use raw Eloquent queries in controllers

### 2. Service Layer Pattern

```php
// app/Services/Admin/ProductService.php

namespace App\Services\Admin;

use App\Models\Product;
use App\Repositories\ProductRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(
        private ProductRepository $productRepository
    ) {}

    public function getPaginatedProducts(array $filters): LengthAwarePaginator
    {
        return $this->productRepository->getPaginatedWithFilters($filters);
    }

    public function createProduct(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            $data['slug'] = Str::slug($data['name']);

            $product = $this->productRepository->create($data);

            // Handle image uploads
            if (isset($data['images'])) {
                $this->handleImageUploads($product, $data['images']);
            }

            return $product->fresh();
        });
    }

    public function updateProduct(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            $data['slug'] = Str::slug($data['name']);

            $product = $this->productRepository->update($product, $data);

            // Handle image updates
            if (isset($data['images'])) {
                $this->handleImageUploads($product, $data['images']);
            }

            return $product->fresh();
        });
    }

    public function deleteProduct(Product $product): bool
    {
        return DB::transaction(function () use ($product) {
            // Delete associated images
            $this->deleteProductImages($product);

            return $this->productRepository->delete($product);
        });
    }

    private function handleImageUploads(Product $product, array $images): void
    {
        // Image upload logic
    }

    private function deleteProductImages(Product $product): void
    {
        // Image deletion logic
    }
}
```

**Key Rules**:
- ✅ Use DB transactions for multi-step operations
- ✅ Use Repository for data access
- ✅ Keep methods focused (Single Responsibility)
- ✅ Use type hints for parameters and return types
- ✅ Extract complex logic into private methods
- ❌ Do NOT access Request directly in services
- ❌ Do NOT use raw DB queries (use Repository)

### 3. Form Request Validation

```php
// app/Http/Requests/Admin/Product/StoreProductRequest.php

namespace App\Http\Requests\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'original_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99', 'gte:price'],
            'category' => ['required', 'string', 'in:미백케어,잇몸케어,민감치아,어린이용,한방치약,토탈케어,선물세트'],
            'features' => ['required', 'array', 'min:1'],
            'features.*' => ['string', 'in:미백,잇몸케어,민감치아,충치예방,구취제거,치석케어'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'image_url' => ['required', 'url'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['url'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => '상품명을 입력해주세요.',
            'price.required' => '가격을 입력해주세요.',
            'price.numeric' => '가격은 숫자만 입력 가능합니다.',
            'category.in' => '유효하지 않은 카테고리입니다.',
            // ... more custom messages
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => '상품명',
            'price' => '가격',
            'category' => '카테고리',
            'stock' => '재고',
        ];
    }
}
```

**Key Rules**:
- ✅ Always override `authorize()` method
- ✅ Use array syntax for validation rules
- ✅ Provide custom error messages in Korean
- ✅ Use `attributes()` for field names in errors
- ✅ Validate all user inputs thoroughly
- ❌ Do NOT skip validation for admin users

### 4. API Resource Pattern

```php
// app/Http/Resources/Admin/ProductResource.php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'originalPrice' => $this->original_price,
            'category' => $this->category,
            'features' => $this->features,
            'rating' => $this->rating,
            'reviewCount' => $this->review_count,
            'stock' => $this->stock,
            'isActive' => $this->is_active,
            'imageUrl' => $this->image_url,
            'images' => $this->images,
            'createdAt' => $this->created_at?->format('Y-m-d H:i:s'),
            'updatedAt' => $this->updated_at?->format('Y-m-d H:i:s'),

            // Relationships (only when loaded)
            $this->mergeWhen($this->relationLoaded('reviews'), [
                'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            ]),
        ];
    }
}
```

**Key Rules**:
- ✅ Use camelCase for JavaScript consumption
- ✅ Use `whenLoaded()` for relationships
- ✅ Format dates consistently
- ✅ Hide sensitive data (never expose passwords, tokens)
- ❌ Do NOT expose internal IDs unnecessarily
- ❌ Do NOT include raw database columns directly

---

## Frontend Development Rules

### 1. Admin Layout Structure

```tsx
// resources/js/Layouts/AdminLayout.tsx

import { PropsWithChildren, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminSidebar from '@/Components/Admin/Sidebar';
import AdminHeader from '@/Components/Admin/Header';
import { PageProps } from '@/types';

interface AdminLayoutProps extends PropsWithChildren {
    title?: string;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
    const { auth, flash } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Head title={title ? `${title} - Admin` : 'Admin Dashboard'} />

            <div className="min-h-screen bg-gray-100">
                <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="lg:pl-64">
                    <AdminHeader onMenuClick={() => setSidebarOpen(true)} user={auth.user} />

                    <main className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {flash?.success && (
                                <div className="mb-4 rounded-md bg-green-50 p-4">
                                    <p className="text-sm text-green-800">{flash.success}</p>
                                </div>
                            )}

                            {flash?.error && (
                                <div className="mb-4 rounded-md bg-red-50 p-4">
                                    <p className="text-sm text-red-800">{flash.error}</p>
                                </div>
                            )}

                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
```

### 2. Admin Page Component Pattern

```tsx
// resources/js/Pages/Admin/Products/Index.tsx

import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/Admin/DataTable';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    isActive: boolean;
    createdAt: string;
}

interface Props {
    products: {
        data: Product[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filters: {
        search?: string;
        category?: string;
    };
}

export default function ProductsIndex({ products, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.products.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (product: Product) => {
        if (confirm(`"${product.name}" 상품을 삭제하시겠습니까?`)) {
            router.delete(route('admin.products.destroy', product.id), {
                preserveScroll: true,
            });
        }
    };

    const columns = [
        {
            header: '상품명',
            accessor: 'name' as const,
            cell: (product: Product) => (
                <Link
                    href={route('admin.products.show', product.id)}
                    className="text-blue-600 hover:underline"
                >
                    {product.name}
                </Link>
            ),
        },
        {
            header: '카테고리',
            accessor: 'category' as const,
        },
        {
            header: '가격',
            accessor: 'price' as const,
            cell: (product: Product) => `₩${product.price.toLocaleString()}`,
        },
        {
            header: '재고',
            accessor: 'stock' as const,
            cell: (product: Product) => (
                <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                    {product.stock}
                </Badge>
            ),
        },
        {
            header: '상태',
            accessor: 'isActive' as const,
            cell: (product: Product) => (
                <Badge variant={product.isActive ? 'success' : 'secondary'}>
                    {product.isActive ? '활성' : '비활성'}
                </Badge>
            ),
        },
        {
            header: '작업',
            accessor: 'id' as const,
            cell: (product: Product) => (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href={route('admin.products.edit', product.id)}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="상품 관리">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
                    <Button asChild>
                        <Link href={route('admin.products.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            상품 등록
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        type="search"
                        placeholder="상품명 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <Button type="submit">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>

                {/* Data Table */}
                <DataTable
                    data={products.data}
                    columns={columns}
                    pagination={products.meta}
                />
            </div>
        </AdminLayout>
    );
}
```

**Key Rules**:
- ✅ Use AdminLayout for all admin pages
- ✅ Use TypeScript interfaces for props
- ✅ Use Inertia's `router` for navigation
- ✅ Use Ziggy's `route()` helper for URLs
- ✅ Use shadcn/ui components for consistency
- ✅ Show confirmation dialogs for destructive actions
- ✅ Use `preserveScroll` and `preserveState` appropriately
- ✅ Handle loading states
- ❌ Do NOT use `window.location` for navigation
- ❌ Do NOT hard-code URLs
- ❌ Do NOT use inline styles

### 3. Form Component Pattern

```tsx
// resources/js/Pages/Admin/Products/Create.tsx

import { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';

interface Props {
    categories: string[];
}

export default function ProductCreate({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        original_price: '',
        category: '',
        features: [] as string[],
        stock: '0',
        is_active: true,
        image_url: '',
        images: [] as string[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    const handleFeatureToggle = (feature: string) => {
        setData('features',
            data.features.includes(feature)
                ? data.features.filter(f => f !== feature)
                : [...data.features, feature]
        );
    };

    const featureOptions = ['미백', '잇몸케어', '민감치아', '충치예방', '구취제거', '치석케어'];

    return (
        <AdminLayout title="상품 등록">
            <div className="max-w-3xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">상품 등록</h1>

                <form onSubmit={submit} className="space-y-6">
                    {/* Product Name */}
                    <div>
                        <Label htmlFor="name">상품명 *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">상품 설명 *</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={5}
                            required
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    {/* Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">판매가 *</Label>
                            <Input
                                id="price"
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                required
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="original_price">정가</Label>
                            <Input
                                id="original_price"
                                type="number"
                                value={data.original_price}
                                onChange={(e) => setData('original_price', e.target.value)}
                            />
                            {errors.original_price && (
                                <p className="mt-1 text-sm text-red-600">{errors.original_price}</p>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <Label htmlFor="category">카테고리 *</Label>
                        <Select
                            value={data.category}
                            onValueChange={(value) => setData('category', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                        )}
                    </div>

                    {/* Features */}
                    <div>
                        <Label>제품 특징 *</Label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                            {featureOptions.map((feature) => (
                                <div key={feature} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`feature-${feature}`}
                                        checked={data.features.includes(feature)}
                                        onCheckedChange={() => handleFeatureToggle(feature)}
                                    />
                                    <Label
                                        htmlFor={`feature-${feature}`}
                                        className="font-normal cursor-pointer"
                                    >
                                        {feature}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.features && (
                            <p className="mt-1 text-sm text-red-600">{errors.features}</p>
                        )}
                    </div>

                    {/* Stock */}
                    <div>
                        <Label htmlFor="stock">재고 수량 *</Label>
                        <Input
                            id="stock"
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            min="0"
                            required
                        />
                        {errors.stock && (
                            <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                        )}
                    </div>

                    {/* Image URL */}
                    <div>
                        <Label htmlFor="image_url">대표 이미지 URL *</Label>
                        <Input
                            id="image_url"
                            type="url"
                            value={data.image_url}
                            onChange={(e) => setData('image_url', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                        {errors.image_url && (
                            <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>
                        )}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                        />
                        <Label htmlFor="is_active" className="font-normal">
                            상품 활성화
                        </Label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-4 pt-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? '등록 중...' : '상품 등록'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            취소
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
```

**Key Rules**:
- ✅ Use Inertia's `useForm` hook
- ✅ Show validation errors inline
- ✅ Disable submit button while processing
- ✅ Use proper input types (number, url, etc.)
- ✅ Mark required fields with asterisk
- ✅ Provide cancel/back button
- ✅ Use controlled components
- ❌ Do NOT submit forms with JavaScript `fetch`
- ❌ Do NOT forget to handle loading states

---

## UI/UX Guidelines

### 1. Color Scheme

**Admin Theme Colors**:
```css
/* Primary Colors */
--admin-primary: #2563eb;      /* Blue 600 */
--admin-primary-hover: #1d4ed8; /* Blue 700 */

/* Status Colors */
--admin-success: #16a34a;      /* Green 600 */
--admin-warning: #ea580c;      /* Orange 600 */
--admin-danger: #dc2626;       /* Red 600 */
--admin-info: #0891b2;         /* Cyan 600 */

/* Neutral Colors */
--admin-gray-50: #f9fafb;
--admin-gray-100: #f3f4f6;
--admin-gray-200: #e5e7eb;
--admin-gray-700: #374151;
--admin-gray-900: #111827;
```

### 2. Typography

```tsx
// Heading Sizes
<h1 className="text-2xl font-bold text-gray-900">  {/* Page Title */}
<h2 className="text-xl font-semibold text-gray-900">  {/* Section Title */}
<h3 className="text-lg font-medium text-gray-900">  {/* Subsection Title */}

// Body Text
<p className="text-base text-gray-700">  {/* Regular text */}
<p className="text-sm text-gray-600">  {/* Small text */}
<p className="text-xs text-gray-500">  {/* Tiny text */}
```

### 3. Spacing

```tsx
// Section Spacing
<div className="space-y-6">  {/* Between sections */}
<div className="space-y-4">  {/* Between form fields */}
<div className="space-y-2">  {/* Label and input */}

// Padding
<div className="p-6">  {/* Card padding */}
<div className="px-4 py-3">  {/* Button-like padding */}
```

### 4. Component Patterns

**Stats Card**:
```tsx
<div className="bg-white rounded-lg shadow p-6">
    <dt className="text-sm font-medium text-gray-500">총 주문</dt>
    <dd className="mt-2 text-3xl font-semibold text-gray-900">1,234</dd>
    <dd className="mt-2 text-sm text-green-600">
        <span className="font-medium">+12.5%</span> 전월 대비
    </dd>
</div>
```

**Table Row Actions**:
```tsx
<div className="flex items-center gap-2">
    <Button variant="outline" size="sm">
        <Edit className="h-4 w-4" />
    </Button>
    <Button variant="outline" size="sm">
        <Trash2 className="h-4 w-4 text-red-600" />
    </Button>
</div>
```

**Status Badges**:
```tsx
// Success
<Badge variant="success">활성</Badge>

// Warning
<Badge variant="warning">대기중</Badge>

// Danger
<Badge variant="destructive">삭제됨</Badge>

// Info
<Badge variant="default">처리중</Badge>
```

---

## Naming Conventions

### 1. File Naming

**Backend**:
```
PascalCase for classes:
- ProductController.php
- ProductService.php
- ProductRepository.php
- Product.php (Model)
- ProductResource.php
- StoreProductRequest.php

snake_case for migrations:
- create_products_table.php
- add_is_admin_to_users_table.php
```

**Frontend**:
```
PascalCase for components:
- ProductList.tsx
- ProductCreate.tsx
- AdminLayout.tsx
- DataTable.tsx

camelCase for utilities:
- formatCurrency.ts
- validateForm.ts
```

### 2. Route Naming

```php
// Pattern: admin.{resource}.{action}
admin.dashboard
admin.products.index
admin.products.create
admin.products.store
admin.products.show
admin.products.edit
admin.products.update
admin.products.destroy
admin.orders.index
admin.orders.show
admin.orders.update-status
```

### 3. Variable Naming

**PHP**:
```php
// camelCase for variables
$productData
$orderItems
$totalAmount

// PascalCase for classes
ProductController
ProductService

// UPPER_CASE for constants
const MAX_UPLOAD_SIZE = 5242880;
const ALLOWED_IMAGE_TYPES = ['jpg', 'png', 'webp'];
```

**TypeScript**:
```tsx
// camelCase for variables and functions
const productList
const handleSubmit
const fetchProducts

// PascalCase for types and interfaces
interface Product
type OrderStatus
interface PageProps

// UPPER_CASE for constants
const MAX_PRODUCTS_PER_PAGE = 20
const API_BASE_URL = '/api'
```

### 4. Database Naming

```sql
-- snake_case for tables and columns
users
products
order_items
user_coupons

-- Singular for table names (Laravel convention)
product (not products)
order (not orders)
user (not users)

-- Prefix for pivot tables
user_coupon
product_category
```

---

## Security Guidelines

### 1. Input Validation

**Always validate on backend**:
```php
// Form Request
public function rules(): array
{
    return [
        'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
        'email' => ['required', 'email', 'max:255'],
        'category' => ['required', 'in:미백케어,잇몸케어,...'],
    ];
}
```

**Sanitize user input**:
```php
use Illuminate\Support\Str;

$cleanedInput = Str::of($request->input('description'))
    ->trim()
    ->limit(1000);
```

### 2. Authorization Checks

**Always check authorization**:
```php
// In Controller
$this->authorize('update', $product);

// Or use Policy
Gate::authorize('update', $product);

// In Blade/Inertia
@can('update', $product)
    // Show edit button
@endcan
```

**Use middleware stacking**:
```php
Route::middleware(['auth', 'admin', 'verified'])->group(function () {
    // Admin routes
});
```

### 3. SQL Injection Prevention

**Always use Eloquent or Query Builder**:
```php
// ✅ Good
Product::where('category', $category)->get();

// ❌ Bad
DB::select("SELECT * FROM products WHERE category = '$category'");
```

### 4. XSS Protection

**React automatically escapes**:
```tsx
// Safe by default
<p>{userInput}</p>

// Only use dangerouslySetInnerHTML when absolutely necessary
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```

### 5. CSRF Protection

**Always include CSRF token in forms**:
```tsx
// Inertia handles this automatically
<form onSubmit={submit}>
    {/* CSRF token automatically included */}
</form>
```

### 6. Mass Assignment Protection

```php
// In Model
protected $fillable = [
    'name',
    'email',
    // Only safe fields
];

protected $guarded = [
    'is_admin', // Prevent mass assignment
    'email_verified_at',
];
```

### 7. Rate Limiting

```php
// In routes
Route::middleware(['throttle:admin'])->group(function () {
    // Admin routes
});

// In app/Providers/AppServiceProvider.php
RateLimiter::for('admin', function (Request $request) {
    return Limit::perMinute(100)->by($request->user()?->id);
});
```

---

## Best Practices Checklist

### Backend Checklist

- [ ] All admin routes use `['auth', 'admin']` middleware
- [ ] All controllers use dependency injection for services
- [ ] All business logic is in Service layer, not controllers
- [ ] All database operations use Repository pattern
- [ ] All user inputs are validated with Form Requests
- [ ] All responses use API Resources
- [ ] All database operations use transactions where appropriate
- [ ] All authorization checks use Policies
- [ ] All sensitive operations are logged
- [ ] All exceptions are properly handled
- [ ] Code follows PSR-12 coding standards
- [ ] Type hints are used for all parameters and return types
- [ ] No N+1 query problems (use eager loading)

### Frontend Checklist

- [ ] All admin pages use `AdminLayout`
- [ ] All components have TypeScript interfaces
- [ ] All navigation uses Inertia's `router` or `Link`
- [ ] All routes use Ziggy's `route()` helper
- [ ] All forms use Inertia's `useForm` hook
- [ ] All validation errors are displayed inline
- [ ] All destructive actions have confirmation dialogs
- [ ] All async operations show loading states
- [ ] All tables have pagination
- [ ] All search/filter operations preserve scroll position
- [ ] All components use shadcn/ui for consistency
- [ ] No inline styles (use Tailwind classes)
- [ ] Accessibility attributes are included (aria-labels, etc.)

### Security Checklist

- [ ] All inputs are validated server-side
- [ ] All authorization checks are performed
- [ ] All SQL queries use Eloquent/Query Builder
- [ ] Mass assignment protection is configured
- [ ] CSRF protection is enabled
- [ ] Rate limiting is configured
- [ ] Sensitive data is not exposed in responses
- [ ] File uploads are validated and sanitized
- [ ] Admin operations are logged
- [ ] HTTPS is enforced in production

### Testing Checklist

- [ ] Feature tests for all CRUD operations
- [ ] Unit tests for Service layer
- [ ] Policy tests for authorization
- [ ] Form Request tests for validation
- [ ] Frontend component tests (optional)
- [ ] E2E tests for critical flows (optional)

---

## Quick Reference

### Create New Admin Resource

1. **Create Migration**
   ```bash
   php artisan make:migration create_products_table
   ```

2. **Create Model**
   ```bash
   php artisan make:model Product
   ```

3. **Create Policy**
   ```bash
   php artisan make:policy ProductPolicy --model=Product
   ```

4. **Create Repository**
   ```bash
   # Manually create: app/Repositories/ProductRepository.php
   ```

5. **Create Service**
   ```bash
   # Manually create: app/Services/Admin/ProductService.php
   ```

6. **Create Form Requests**
   ```bash
   php artisan make:request Admin/Product/StoreProductRequest
   php artisan make:request Admin/Product/UpdateProductRequest
   ```

7. **Create Resource**
   ```bash
   php artisan make:resource Admin/ProductResource
   ```

8. **Create Controller**
   ```bash
   php artisan make:controller Admin/ProductController --resource
   ```

9. **Add Routes**
   ```php
   // routes/admin.php
   Route::resource('products', ProductController::class);
   ```

10. **Create Frontend Pages**
    ```
    resources/js/Pages/Admin/Products/
    ├── Index.tsx
    ├── Create.tsx
    ├── Edit.tsx
    └── Show.tsx
    ```

---

## Troubleshooting

### Common Issues

**Issue**: "Unauthorized access to admin area"
```
Solution: Check if user has is_admin = true in database
```

**Issue**: "Route [admin.products.index] not defined"
```
Solution: Make sure admin.php routes are included in web.php
// web.php
require __DIR__.'/admin.php';
```

**Issue**: "This action is unauthorized" (403)
```
Solution: Check Policy and make sure user passes authorization
```

**Issue**: Inertia page not found
```
Solution: Check that component name matches route return
// Controller
return Inertia::render('Admin/Products/Index'); // Must match file path
```

---

## Version History

| Version | Date       | Changes                          |
|---------|------------|----------------------------------|
| 1.0.0   | 2025-11-20 | Initial admin page rules created |

---

**Last Updated**: 2025-11-20
**Maintainer**: Development Team
**Status**: Active
