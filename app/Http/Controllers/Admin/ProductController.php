<?php

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
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $filters = request()->only([
            'search',
            'category',
            'brand',
            'is_active',
            'is_featured',
            'is_new',
            'is_best_seller',
            'stock_status',
            'sort_by',
            'sort_order',
        ]);
        $products = $this->productService->getPaginatedProducts($filters, 20);

        return Inertia::render('Admin/Products/Index', [
            'products' => ProductResource::collection($products)->additional([
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ],
            ]),
            'filters' => $filters,
            'categories' => $this->productService->getCategoryOptions(),
            'statistics' => $this->productService->getStatistics(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => $this->productService->getCategoryOptions(),
            'features' => $this->productService->getFeatures(),
            'targetAudiences' => $this->productService->getTargetAudiences(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            $product = $this->productService->createProduct($request->validated());

            return redirect()
                ->route('admin.products.index')
                ->with('success', '상품이 등록되었습니다.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', '상품 등록에 실패했습니다: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): Response
    {
        return Inertia::render('Admin/Products/Show', [
            'product' => new ProductResource($product),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => new ProductResource($product),
            'categories' => $this->productService->getCategoryOptions(),
            'features' => $this->productService->getFeatures(),
            'targetAudiences' => $this->productService->getTargetAudiences(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            $this->productService->updateProduct($product, $request->validated());

            return redirect()
                ->route('admin.products.index')
                ->with('success', '상품이 수정되었습니다.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', '상품 수정에 실패했습니다: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            $this->productService->deleteProduct($product);

            return redirect()
                ->route('admin.products.index')
                ->with('success', '상품이 삭제되었습니다.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', '상품 삭제에 실패했습니다: ' . $e->getMessage());
        }
    }
}
