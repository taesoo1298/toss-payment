import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ProductFormProps } from './types';
import { DollarSign, Package } from 'lucide-react';

export default function PriceStockSection({
    data,
    setData,
    errors,
}: Omit<ProductFormProps, 'categories' | 'features' | 'targetAudiences'>) {
    const discountPercentage =
        data.price && data.original_price
            ? Math.round(
                  ((parseFloat(data.original_price) - parseFloat(data.price)) /
                      parseFloat(data.original_price)) *
                      100
              )
            : 0;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    가격 및 재고 관리
                </h3>
                <p className="text-sm text-gray-500">
                    가격 정보와 재고 수량을 설정해주세요.
                </p>
            </div>

            {/* 가격 정보 */}
            <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-sm text-gray-700">가격 정보</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 판매가 */}
                    <div>
                        <Label htmlFor="price">
                            판매가 <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₩
                            </span>
                            <Input
                                id="price"
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="pl-8"
                                placeholder="0"
                                min="0"
                                step="100"
                            />
                        </div>
                        {errors.price && (
                            <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                        )}
                    </div>

                    {/* 정가 */}
                    <div>
                        <Label htmlFor="original_price">정가 (할인 전 가격)</Label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₩
                            </span>
                            <Input
                                id="original_price"
                                type="number"
                                value={data.original_price || ''}
                                onChange={(e) => setData('original_price', e.target.value)}
                                className="pl-8"
                                placeholder="0"
                                min="0"
                                step="100"
                            />
                        </div>
                        {discountPercentage > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                                할인율: {discountPercentage}%
                            </p>
                        )}
                        {errors.original_price && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.original_price}
                            </p>
                        )}
                    </div>

                    {/* 원가 */}
                    <div>
                        <Label htmlFor="cost_price">원가 (관리용)</Label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₩
                            </span>
                            <Input
                                id="cost_price"
                                type="number"
                                value={data.cost_price || ''}
                                onChange={(e) => setData('cost_price', e.target.value)}
                                className="pl-8"
                                placeholder="0"
                                min="0"
                                step="100"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">고객에게 표시되지 않습니다</p>
                        {errors.cost_price && (
                            <p className="text-sm text-red-600 mt-1">{errors.cost_price}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* 재고 관리 */}
            <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    재고 관리
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 재고 수량 */}
                    <div>
                        <Label htmlFor="stock">
                            재고 수량 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="stock"
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            className="mt-1"
                            placeholder="0"
                            min="0"
                        />
                        {errors.stock && (
                            <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
                        )}
                    </div>

                    {/* 재고 부족 기준 */}
                    <div>
                        <Label htmlFor="low_stock_threshold">
                            재고 부족 알림 기준
                        </Label>
                        <Input
                            id="low_stock_threshold"
                            type="number"
                            value={data.low_stock_threshold || '10'}
                            onChange={(e) =>
                                setData('low_stock_threshold', e.target.value)
                            }
                            className="mt-1"
                            placeholder="10"
                            min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            이 수량 이하로 재고가 떨어지면 알림을 받습니다
                        </p>
                        {errors.low_stock_threshold && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.low_stock_threshold}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
