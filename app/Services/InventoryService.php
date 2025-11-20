<?php

namespace App\Services;

use App\Models\InventoryTransaction;
use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * 재고 조정
     *
     * @param  Product  $product
     * @param  int  $quantity  양수=입고, 음수=출고
     * @param  string  $type
     * @param  string|null  $referenceType
     * @param  int|null  $referenceId
     * @param  string|null  $note
     * @param  int|null  $userId
     * @return InventoryTransaction
     */
    public function adjustStock(
        Product $product,
        int $quantity,
        string $type = 'adjustment',
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?string $note = null,
        ?int $userId = null
    ): InventoryTransaction {
        return DB::transaction(function () use ($product, $quantity, $type, $referenceType, $referenceId, $note, $userId) {
            $stockBefore = $product->stock;
            $stockAfter = $stockBefore + $quantity;

            // 재고 업데이트
            $product->update(['stock' => $stockAfter]);

            // 트랜잭션 기록
            return InventoryTransaction::create([
                'product_id' => $product->id,
                'type' => $type,
                'quantity' => $quantity,
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'note' => $note,
                'created_by' => $userId ?? auth()->id(),
            ]);
        });
    }

    /**
     * 입고 처리
     *
     * @param  Product  $product
     * @param  int  $quantity
     * @param  string|null  $note
     * @return InventoryTransaction
     */
    public function purchase(Product $product, int $quantity, ?string $note = null): InventoryTransaction
    {
        return $this->adjustStock($product, $quantity, 'purchase', null, null, $note);
    }

    /**
     * 출고 처리 (판매)
     *
     * @param  Product  $product
     * @param  int  $quantity
     * @param  int|null  $orderId
     * @return InventoryTransaction
     */
    public function sale(Product $product, int $quantity, ?int $orderId = null): InventoryTransaction
    {
        return $this->adjustStock($product, -$quantity, 'sale', 'Order', $orderId, '상품 판매');
    }

    /**
     * 반품 처리
     *
     * @param  Product  $product
     * @param  int  $quantity
     * @param  int|null  $returnId
     * @return InventoryTransaction
     */
    public function return(Product $product, int $quantity, ?int $returnId = null): InventoryTransaction
    {
        return $this->adjustStock($product, $quantity, 'return', 'Return', $returnId, '상품 반품');
    }

    /**
     * 재고 부족 상품 확인
     *
     * @return Collection
     */
    public function checkLowStock(): Collection
    {
        return Product::lowStock()
            ->active()
            ->get();
    }

    /**
     * 상품별 재고 이력 조회
     *
     * @param  Product  $product
     * @param  int  $limit
     * @return Collection
     */
    public function getTransactionHistory(Product $product, int $limit = 50): Collection
    {
        return $product->inventoryTransactions()
            ->with('creator')
            ->limit($limit)
            ->get();
    }

    /**
     * 재고 부족 알림이 필요한 상품 확인
     *
     * @return Collection
     */
    public function getProductsNeedingRestock(): Collection
    {
        return Product::lowStock()
            ->active()
            ->with('inventoryTransactions')
            ->get();
    }

    /**
     * 재고 통계
     *
     * @return array
     */
    public function getStockStatistics(): array
    {
        return [
            'total_products' => Product::count(),
            'in_stock' => Product::where('stock', '>', 0)->count(),
            'out_of_stock' => Product::where('stock', '=', 0)->count(),
            'low_stock' => Product::lowStock()->count(),
            'total_stock_value' => Product::sum(DB::raw('stock * price')),
        ];
    }
}
