<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // delivered 상태의 주문만 리뷰 대상
        $deliveredOrders = Order::where('status', 'delivered')
            ->with(['items', 'user'])
            ->get();

        foreach ($deliveredOrders as $order) {
            // 각 주문의 아이템 중 50% 확률로 리뷰 작성
            foreach ($order->items as $item) {
                if (rand(1, 100) <= 50) {
                    $rating = $this->getWeightedRating();

                    Review::create([
                        'product_id' => $item->product_id,
                        'user_id' => $order->user_id,
                        'order_item_id' => $item->id,
                        'rating' => $rating,
                        'content' => $this->getReviewContent($rating),
                        'images' => rand(1, 100) <= 30 ? [
                            '/images/reviews/' . rand(1, 100) . '.jpg',
                            '/images/reviews/' . rand(1, 100) . '.jpg',
                        ] : null,
                        'is_verified' => true, // 구매 확정된 리뷰
                        'created_at' => $order->created_at->addDays(rand(3, 14)),
                        'updated_at' => $order->created_at->addDays(rand(3, 14)),
                    ]);
                }
            }
        }
    }

    private function getWeightedRating(): int
    {
        // 평점 분포 (4-5점이 더 많이 나오도록)
        $weights = [
            1 => 3,
            2 => 5,
            3 => 12,
            4 => 35,
            5 => 45,
        ];

        $rand = rand(1, array_sum($weights));
        foreach ($weights as $rating => $weight) {
            $rand -= $weight;
            if ($rand <= 0) {
                return $rating;
            }
        }
        return 5;
    }

    private function getReviewContent(int $rating): string
    {
        $reviews = [
            5 => [
                '정말 만족스러운 제품입니다. 효과도 좋고 가격도 합리적이에요!',
                '사용감이 아주 좋아요. 다음에도 재구매 의사 100%입니다.',
                '가족 모두 사용하고 있어요. 강력 추천합니다!',
                '치아가 정말 깨끗해진 느낌이에요. 최고예요!',
                '배송도 빠르고 제품도 너무 좋아요. 감사합니다!',
                '기대 이상입니다. 앞으로 계속 구매할 예정이에요.',
                '품질이 정말 좋네요. 주변에도 추천했습니다.',
            ],
            4 => [
                '전반적으로 만족합니다. 가격 대비 괜찮은 제품이에요.',
                '사용해보니 좋네요. 별 하나 뺀 이유는 향이 조금 강해서요.',
                '효과는 좋은데 가격이 조금 아쉬워요. 그래도 만족합니다.',
                '기대했던 것만큼은 아니지만 나쁘지 않아요.',
                '배송이 생각보다 오래 걸렸지만 제품은 좋아요.',
                '사용감은 좋은데 용량이 좀 작은 것 같아요.',
            ],
            3 => [
                '보통입니다. 특별히 나쁘지도 좋지도 않아요.',
                '다른 제품과 비교해봐야 할 것 같아요.',
                '가격 생각하면 이 정도는 괜찮은 것 같습니다.',
                '기대했던 것보다는 평범해요.',
                '쓸만한데 재구매는 고민됩니다.',
            ],
            2 => [
                '기대보다 별로예요. 다른 제품을 알아봐야겠어요.',
                '효과를 못 느끼겠어요. 조금 실망스럽습니다.',
                '가격 대비 아쉬운 제품이에요.',
                '다시 사기는 어려울 것 같아요.',
            ],
            1 => [
                '전혀 효과가 없어요. 돈 아까워요.',
                '기대했는데 너무 실망스럽습니다.',
                '품질이 너무 안 좋아요. 환불하고 싶습니다.',
                '최악의 제품입니다. 비추천합니다.',
            ],
        ];

        $ratingReviews = $reviews[$rating];
        return $ratingReviews[array_rand($ratingReviews)];
    }
}
