<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Coupon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();
        $coupons = Coupon::where('is_active', true)->get();

        $statuses = ['pending', 'preparing', 'shipping', 'delivered', 'cancelled'];
        $orderCount = 0;

        foreach ($users as $user) {
            // 각 유저당 1-5개의 주문 생성
            $numOrders = rand(1, 5);

            for ($i = 0; $i < $numOrders; $i++) {
                $orderCount++;

                // 주문 상태 랜덤 선택 (delivered가 더 많이 나오도록)
                $statusWeights = ['pending' => 10, 'preparing' => 15, 'shipping' => 15, 'delivered' => 50, 'cancelled' => 10];
                $status = $this->weightedRandom($statusWeights);

                // 쿠폰 랜덤 선택 (50% 확률)
                $coupon = (rand(1, 100) <= 50 && $coupons->isNotEmpty()) ? $coupons->random() : null;

                // 주문 아이템 생성 (1-4개)
                $numItems = rand(1, 4);
                $selectedProducts = $products->random(min($numItems, $products->count()));

                $subtotal = 0;
                $items = [];

                foreach ($selectedProducts as $product) {
                    $quantity = rand(1, 3);
                    $itemSubtotal = $product->price * $quantity;
                    $subtotal += $itemSubtotal;

                    $items[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_image' => $product->thumbnail_url,
                        'quantity' => $quantity,
                        'price' => $product->price,
                        'subtotal' => $itemSubtotal,
                    ];
                }

                // 배송비 계산 (30,000원 이상 무료)
                $shippingCost = $subtotal >= 30000 ? 0 : 3000;

                // 쿠폰 할인 계산
                $couponDiscount = 0;
                if ($coupon) {
                    if ($coupon->discount_type === 'percentage') {
                        $discount = $subtotal * ($coupon->discount_value / 100);
                        $couponDiscount = $coupon->max_discount_amount
                            ? min($discount, $coupon->max_discount_amount)
                            : $discount;
                    } else {
                        $couponDiscount = $coupon->discount_value;
                    }
                }

                $totalAmount = $subtotal + $shippingCost - $couponDiscount;

                // 주문 날짜 랜덤 (최근 60일 이내)
                $createdAt = Carbon::now()->subDays(rand(0, 60));

                $order = Order::create([
                    'order_id' => 'ORD' . date('Ymd') . str_pad($orderCount, 6, '0', STR_PAD_LEFT),
                    'user_id' => $user->id,
                    'status' => $status,
                    'customer_name' => $user->name,
                    'customer_email' => $user->email,
                    'customer_phone' => '010-' . rand(1000, 9999) . '-' . rand(1000, 9999),
                    'recipient_name' => $user->name,
                    'recipient_phone' => '010-' . rand(1000, 9999) . '-' . rand(1000, 9999),
                    'postal_code' => rand(10000, 99999),
                    'address' => $this->getRandomAddress(),
                    'address_detail' => rand(1, 20) . '호',
                    'delivery_memo' => $this->getRandomDeliveryMemo(),
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shippingCost,
                    'coupon_discount' => $couponDiscount,
                    'total_amount' => $totalAmount,
                    'coupon_id' => $coupon?->id,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                // 주문 아이템 생성
                foreach ($items as $item) {
                    OrderItem::create(array_merge($item, [
                        'order_id' => $order->id,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]));
                }
            }
        }
    }

    private function weightedRandom(array $weights): string
    {
        $rand = rand(1, array_sum($weights));
        foreach ($weights as $key => $weight) {
            $rand -= $weight;
            if ($rand <= 0) {
                return $key;
            }
        }
        return array_key_first($weights);
    }

    private function getRandomAddress(): string
    {
        $addresses = [
            '서울특별시 강남구 테헤란로 123',
            '서울특별시 송파구 올림픽로 456',
            '서울특별시 마포구 월드컵로 789',
            '경기도 성남시 분당구 판교역로 234',
            '경기도 수원시 영통구 광교중앙로 567',
            '부산광역시 해운대구 센텀중앙로 890',
            '대구광역시 수성구 동대구로 345',
            '인천광역시 연수구 송도과학로 678',
        ];
        return $addresses[array_rand($addresses)];
    }

    private function getRandomDeliveryMemo(): ?string
    {
        $memos = [
            '부재 시 문 앞에 놓아주세요',
            '경비실에 맡겨주세요',
            '배송 전 연락 부탁드립니다',
            '빠른 배송 부탁드립니다',
            null, // 메모 없음
            null,
        ];
        return $memos[array_rand($memos)];
    }
}
