<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'WELCOME2025',
                'name' => '신규가입 환영 쿠폰',
                'description' => '신규 가입 고객 전용 10% 할인 쿠폰',
                'discount_type' => 'percentage',
                'discount_value' => 10,
                'min_purchase_amount' => 30000,
                'max_discount_amount' => 10000,
                'usage_limit' => 1000,
                'usage_count' => 124,
                'valid_from' => Carbon::now()->subDays(30),
                'valid_until' => Carbon::now()->addMonths(3),
                'is_active' => true,
            ],
            [
                'code' => 'FIRST5000',
                'name' => '첫 구매 5천원 할인',
                'description' => '첫 구매 고객 전용 5,000원 할인 쿠폰',
                'discount_type' => 'fixed',
                'discount_value' => 5000,
                'min_purchase_amount' => 20000,
                'usage_limit' => 500,
                'usage_count' => 87,
                'valid_from' => Carbon::now()->subDays(15),
                'valid_until' => Carbon::now()->addMonths(2),
                'is_active' => true,
            ],
            [
                'code' => 'SMILE20',
                'name' => '닥터스마일 특별 할인 20%',
                'description' => '전 품목 20% 할인 (최대 15,000원)',
                'discount_type' => 'percentage',
                'discount_value' => 20,
                'min_purchase_amount' => 50000,
                'max_discount_amount' => 15000,
                'usage_limit' => 200,
                'usage_count' => 156,
                'valid_from' => Carbon::now()->subDays(7),
                'valid_until' => Carbon::now()->addDays(23),
                'is_active' => true,
            ],
            [
                'code' => 'TOOTHPASTE3000',
                'name' => '치약 구매 할인',
                'description' => '치약 구매 시 3,000원 할인',
                'discount_type' => 'fixed',
                'discount_value' => 3000,
                'min_purchase_amount' => 15000,
                'applicable_categories' => ['치약'],
                'usage_count' => 45,
                'valid_from' => Carbon::now()->subDays(10),
                'valid_until' => Carbon::now()->addDays(20),
                'is_active' => true,
            ],
            [
                'code' => 'VIP15',
                'name' => 'VIP 전용 15% 할인',
                'description' => 'VIP 회원 전용 15% 할인 쿠폰',
                'discount_type' => 'percentage',
                'discount_value' => 15,
                'min_purchase_amount' => 0,
                'max_discount_amount' => 20000,
                'usage_limit' => 100,
                'usage_count' => 23,
                'valid_from' => Carbon::now()->subDays(5),
                'valid_until' => Carbon::now()->addMonths(1),
                'is_active' => true,
            ],
            [
                'code' => 'SUMMER2024',
                'name' => '여름 시즌 특가',
                'description' => '여름 시즌 한정 할인 (종료됨)',
                'discount_type' => 'percentage',
                'discount_value' => 25,
                'min_purchase_amount' => 40000,
                'max_discount_amount' => 10000,
                'usage_limit' => 500,
                'usage_count' => 487,
                'valid_from' => Carbon::now()->subMonths(2),
                'valid_until' => Carbon::now()->subDays(15),
                'is_active' => false,
            ],
        ];

        foreach ($coupons as $coupon) {
            Coupon::create($coupon);
        }
    }
}
