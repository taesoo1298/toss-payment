<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // pending과 cancelled를 제외한 주문들에 대해 결제 데이터 생성
        $orders = Order::whereNotIn('status', ['pending', 'cancelled'])
            ->with('user', 'items')
            ->get();

        foreach ($orders as $order) {
            $paymentMethods = ['card', 'virtual_account', 'transfer', 'easy_pay'];
            $method = $paymentMethods[array_rand($paymentMethods)];

            // 주문 상태에 따른 결제 상태 매핑
            $paymentStatus = match($order->status) {
                'preparing', 'shipping', 'delivered' => 'done',
                'refunded' => 'canceled',
                default => 'pending',
            };

            // 결제 키 생성
            $paymentKey = $paymentStatus === 'done'
                ? 'tpk_' . Str::random(40)
                : null;

            // 주문명 생성
            $firstItem = $order->items->first();
            $itemCount = $order->items->count();
            $orderName = $firstItem->product_name . ($itemCount > 1 ? " 외 {$itemCount}건" : '');

            // 카드 정보 (카드 결제인 경우)
            $cardInfo = $method === 'card' ? [
                'card_company' => $this->getRandomCardCompany(),
                'card_number' => '****-****-****-' . rand(1000, 9999),
                'card_type' => rand(0, 1) ? 'credit' : 'check',
            ] : [
                'card_company' => null,
                'card_number' => null,
                'card_type' => null,
            ];

            // 승인 시간 (완료된 결제만)
            $approvedAt = $paymentStatus === 'done'
                ? $order->created_at->addMinutes(rand(1, 5))
                : null;

            // 취소 시간 (취소된 결제만)
            $canceledAt = $paymentStatus === 'canceled'
                ? $order->updated_at
                : null;

            // VAT 계산 (총액의 10%)
            $vat = floor($order->total_amount / 11);
            $suppliedAmount = $order->total_amount - $vat;

            Payment::create([
                'user_id' => $order->user_id,
                'order_id' => $order->order_id,
                'payment_key' => $paymentKey,
                'order_name' => $orderName,

                // Customer Info
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_mobile_phone' => $order->customer_phone,

                // Payment Info
                'method' => $method,
                'status' => $paymentStatus,

                // Timestamps
                'requested_at' => $order->created_at,
                'approved_at' => $approvedAt,
                'canceled_at' => $canceledAt,

                // Amount Info
                'total_amount' => $order->total_amount,
                'balance_amount' => $paymentStatus === 'done' ? $order->total_amount : 0,
                'supplied_amount' => $suppliedAmount,
                'vat' => $vat,
                'tax_free_amount' => 0,
                'discount_amount' => $order->coupon_discount,
                'cancel_amount' => $paymentStatus === 'canceled' ? $order->total_amount : 0,

                // Additional Info
                'currency' => 'KRW',
                'country' => 'KR',

                // Card Info
                'card_company' => $cardInfo['card_company'],
                'card_number' => $cardInfo['card_number'],
                'card_type' => $cardInfo['card_type'],

                // URLs
                'receipt_url' => $paymentStatus === 'done'
                    ? 'https://dashboard.tosspayments.com/receipt/' . Str::random(20)
                    : null,

                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ]);
        }
    }

    private function getRandomCardCompany(): string
    {
        $companies = [
            '신한카드',
            '삼성카드',
            '현대카드',
            '롯데카드',
            'KB국민카드',
            'NH농협카드',
            'BC카드',
            '우리카드',
            '하나카드',
        ];
        return $companies[array_rand($companies)];
    }
}
