<?php

namespace App\Services\Admin;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Repositories\ProductRepository;
use App\Services\InventoryService;
use App\Services\ProductImageService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(
        private ProductRepository $productRepository,
        private ProductImageService $imageService,
        private InventoryService $inventoryService
    ) {}

    public function getPaginatedProducts(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return $this->productRepository->getPaginatedWithFilters($filters, $perPage);
    }

    public function getProduct(int $id): ?Product
    {
        return $this->productRepository->find($id);
    }

    public function createProduct(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            // Generate slug from name
            $data['slug'] = Str::slug($data['name']);

            // Ensure unique slug
            $originalSlug = $data['slug'];
            $count = 1;
            while ($this->productRepository->findBySlug($data['slug'])) {
                $data['slug'] = $originalSlug.'-'.$count;
                $count++;
            }

            // Generate SKU if not provided
            if (empty($data['sku'])) {
                $data['sku'] = 'PRD-'.strtoupper(Str::random(8));
            }

            // Handle thumbnail image upload
            if (isset($data['thumbnail']) && $data['thumbnail']) {
                $data['thumbnail_url'] = $this->imageService->uploadThumbnail($data['thumbnail']);
                unset($data['thumbnail']);
            }

            // Handle multiple images upload
            if (isset($data['product_images']) && is_array($data['product_images'])) {
                $imageUrls = [];
                foreach ($data['product_images'] as $image) {
                    if ($image) {
                        $processed = $this->imageService->processImage($image);
                        $imageUrls[] = $processed['original'];
                    }
                }
                $data['images'] = $imageUrls;
                unset($data['product_images']);
            }

            // Set published_at to now if product is active and not set
            if (!isset($data['published_at']) && ($data['is_active'] ?? false)) {
                $data['published_at'] = now();
            }

            $product = $this->productRepository->create($data);

            // Create initial inventory transaction if stock is set
            if (isset($data['stock']) && $data['stock'] > 0) {
                $this->inventoryService->adjustStock(
                    $product,
                    $data['stock'],
                    'purchase',
                    null,
                    null,
                    '초기 재고 등록'
                );
            }

            return $product;
        });
    }

    public function updateProduct(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            // Update slug if name changed
            if (isset($data['name']) && $data['name'] !== $product->name) {
                $data['slug'] = Str::slug($data['name']);

                // Ensure unique slug (excluding current product)
                $originalSlug = $data['slug'];
                $count = 1;
                while ($existingProduct = $this->productRepository->findBySlug($data['slug'])) {
                    if ($existingProduct->id !== $product->id) {
                        $data['slug'] = $originalSlug.'-'.$count;
                        $count++;
                    } else {
                        break;
                    }
                }
            }

            // Handle thumbnail image upload
            if (isset($data['thumbnail']) && $data['thumbnail']) {
                // Delete old thumbnail if exists
                if ($product->thumbnail_url) {
                    $this->imageService->deleteImage($product->thumbnail_url);
                }
                $data['thumbnail_url'] = $this->imageService->uploadThumbnail($data['thumbnail']);
                unset($data['thumbnail']);
            }

            // Handle multiple images upload
            if (isset($data['product_images']) && is_array($data['product_images'])) {
                $imageUrls = $product->images ?? [];
                foreach ($data['product_images'] as $image) {
                    if ($image) {
                        $processed = $this->imageService->processImage($image);
                        $imageUrls[] = $processed['original'];
                    }
                }
                $data['images'] = $imageUrls;
                unset($data['product_images']);
            }

            // Handle stock adjustment with inventory tracking
            if (isset($data['stock']) && $data['stock'] != $product->stock) {
                $difference = $data['stock'] - $product->stock;
                $this->inventoryService->adjustStock(
                    $product,
                    $difference,
                    'adjustment',
                    null,
                    null,
                    '관리자에 의한 재고 조정'
                );
            }

            // Set published_at when activating product for the first time
            if (isset($data['is_active']) && $data['is_active'] && !$product->is_active && !$product->published_at) {
                $data['published_at'] = now();
            }

            return $this->productRepository->update($product, $data);
        });
    }

    public function deleteProduct(Product $product): bool
    {
        return DB::transaction(function () use ($product) {
            // Check if product has any orders
            // if ($product->orderItems()->exists()) {
            //     throw new \Exception('Cannot delete product with existing orders');
            // }

            return $this->productRepository->delete($product);
        });
    }

    public function toggleProductStatus(Product $product): Product
    {
        return $this->productRepository->update($product, [
            'is_active' => !$product->is_active,
        ]);
    }

    public function updateStock(Product $product, int $stock): Product
    {
        return $this->productRepository->updateStock($product, $stock);
    }

    public function getCategories(): array
    {
        return ProductCategory::active()
            ->rootCategories()
            ->pluck('name', 'slug')
            ->toArray();
    }

    public function getCategoryOptions(): array
    {
        $categories = ProductCategory::active()
            ->rootCategories()
            ->get();

        return $categories->map(function ($category) {
            return [
                'value' => $category->slug,
                'label' => $category->name,
            ];
        })->toArray();
    }

    public function getFeatures(): array
    {
        return [
            '미백',
            '잇몸케어',
            '민감치아',
            '충치예방',
            '구취제거',
            '치석케어',
            '자연성분',
            '불소함유',
        ];
    }

    public function getTargetAudiences(): array
    {
        return [
            '성인',
            '어린이',
            '노인',
            '임산부',
            '청소년',
        ];
    }

    public function getStatistics(): array
    {
        return [
            'total' => Product::count(),
            'active' => Product::where('is_active', true)->count(),
            'inactive' => Product::where('is_active', false)->count(),
            'low_stock' => Product::lowStock()->count(),
            'out_of_stock' => Product::where('stock', 0)->count(),
            'featured' => Product::where('is_featured', true)->count(),
            'new' => Product::where('is_new', true)->count(),
            'best_seller' => Product::where('is_best_seller', true)->count(),
        ];
    }

    public function bulkUpdateStatus(array $productIds, bool $isActive): int
    {
        return Product::whereIn('id', $productIds)->update(['is_active' => $isActive]);
    }

    public function bulkDelete(array $productIds): int
    {
        return Product::whereIn('id', $productIds)->delete();
    }
}
