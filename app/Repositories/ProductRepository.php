<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository
{
    public function __construct(
        private Product $model
    ) {}

    public function find(int $id): ?Product
    {
        return $this->model->find($id);
    }

    public function findBySlug(string $slug): ?Product
    {
        return $this->model->where('slug', $slug)->first();
    }

    public function create(array $data): Product
    {
        return $this->model->create($data);
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        return $product->fresh();
    }

    public function delete(Product $product): bool
    {
        return $product->delete();
    }

    public function getPaginatedWithFilters(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = $this->model->query();

        // Search by name, SKU, or description
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%'.$filters['search'].'%')
                    ->orWhere('sku', 'like', '%'.$filters['search'].'%')
                    ->orWhere('short_description', 'like', '%'.$filters['search'].'%');
            });
        }

        // Filter by category
        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        // Filter by brand
        if (!empty($filters['brand'])) {
            $query->where('brand', $filters['brand']);
        }

        // Filter by active status
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // Filter by featured
        if (isset($filters['is_featured'])) {
            $query->where('is_featured', $filters['is_featured']);
        }

        // Filter by new products
        if (isset($filters['is_new'])) {
            $query->where('is_new', $filters['is_new']);
        }

        // Filter by best sellers
        if (isset($filters['is_best_seller'])) {
            $query->where('is_best_seller', $filters['is_best_seller']);
        }

        // Filter by price range
        if (!empty($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (!empty($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        // Filter by stock status
        if (!empty($filters['stock_status'])) {
            switch ($filters['stock_status']) {
                case 'in_stock':
                    $query->where('stock', '>', 0);
                    break;
                case 'out_of_stock':
                    $query->where('stock', '=', 0);
                    break;
                case 'low_stock':
                    $query->whereColumn('stock', '<=', 'low_stock_threshold');
                    break;
            }
        }

        // Filter by features
        if (!empty($filters['features']) && is_array($filters['features'])) {
            foreach ($filters['features'] as $feature) {
                $query->whereJsonContains('features', $feature);
            }
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';

        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($perPage);
    }

    public function getAllActive(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getByCategory(string $category): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model
            ->where('category', $category)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function searchByName(string $query): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model
            ->where('name', 'like', '%' . $query . '%')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function updateStock(Product $product, int $quantity): Product
    {
        $product->update(['stock' => $quantity]);
        return $product->fresh();
    }

    public function decrementStock(Product $product, int $quantity): Product
    {
        $product->decrement('stock', $quantity);
        return $product->fresh();
    }

    public function incrementStock(Product $product, int $quantity): Product
    {
        $product->increment('stock', $quantity);
        return $product->fresh();
    }
}
