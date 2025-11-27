<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // 사이트 설정
            [
                'key' => 'site_name',
                'value' => 'Dr.Smile',
                'type' => 'string',
                'group' => 'general',
                'label' => '사이트명',
                'description' => '쇼핑몰 이름',
            ],
            [
                'key' => 'site_phone',
                'value' => '1588-0000',
                'type' => 'string',
                'group' => 'general',
                'label' => '고객센터 전화번호',
                'description' => '고객 문의 전화번호',
            ],
            [
                'key' => 'site_email',
                'value' => 'support@drsmile.com',
                'type' => 'string',
                'group' => 'general',
                'label' => '고객센터 이메일',
                'description' => '고객 문의 이메일',
            ],
            [
                'key' => 'business_number',
                'value' => '123-45-67890',
                'type' => 'string',
                'group' => 'general',
                'label' => '사업자등록번호',
                'description' => '사업자등록번호',
            ],
            [
                'key' => 'business_owner',
                'value' => '홍길동',
                'type' => 'string',
                'group' => 'general',
                'label' => '대표자명',
                'description' => '사업자 대표자 이름',
            ],
            [
                'key' => 'business_address',
                'value' => '서울특별시 강남구 테헤란로 123',
                'type' => 'string',
                'group' => 'general',
                'label' => '사업장 주소',
                'description' => '사업장 소재지',
            ],

            // 배송 설정
            [
                'key' => 'shipping_fee',
                'value' => '3000',
                'type' => 'number',
                'group' => 'shipping',
                'label' => '기본 배송비',
                'description' => '기본 배송비 (원)',
            ],
            [
                'key' => 'free_shipping_threshold',
                'value' => '30000',
                'type' => 'number',
                'group' => 'shipping',
                'label' => '무료배송 기준금액',
                'description' => '무료배송이 적용되는 최소 주문금액 (원)',
            ],
            [
                'key' => 'shipping_policy',
                'value' => '평일 오후 3시 이전 주문시 당일 발송됩니다.\n주말 및 공휴일은 발송되지 않습니다.\n제주도 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.',
                'type' => 'string',
                'group' => 'shipping',
                'label' => '배송 정책',
                'description' => '배송 관련 안내 문구',
            ],

            // 포인트 설정
            [
                'key' => 'point_rate',
                'value' => '1',
                'type' => 'number',
                'group' => 'point',
                'label' => '기본 적립률',
                'description' => '구매금액 대비 적립 비율 (%)',
            ],
            [
                'key' => 'point_signup',
                'value' => '1000',
                'type' => 'number',
                'group' => 'point',
                'label' => '회원가입 포인트',
                'description' => '회원가입 시 지급되는 포인트',
            ],
            [
                'key' => 'point_review',
                'value' => '500',
                'type' => 'number',
                'group' => 'point',
                'label' => '리뷰 작성 포인트',
                'description' => '리뷰 작성 시 지급되는 포인트',
            ],
            [
                'key' => 'point_review_photo',
                'value' => '1000',
                'type' => 'number',
                'group' => 'point',
                'label' => '포토리뷰 포인트',
                'description' => '사진이 포함된 리뷰 작성 시 지급되는 포인트',
            ],
            [
                'key' => 'point_min_use',
                'value' => '5000',
                'type' => 'number',
                'group' => 'point',
                'label' => '최소 사용 포인트',
                'description' => '한 번에 사용할 수 있는 최소 포인트',
            ],

            // 주문 설정
            [
                'key' => 'order_cancel_limit_hours',
                'value' => '24',
                'type' => 'number',
                'group' => 'order',
                'label' => '주문 취소 가능 시간',
                'description' => '주문 후 취소 가능한 시간 (시간)',
            ],
            [
                'key' => 'return_policy_days',
                'value' => '7',
                'type' => 'number',
                'group' => 'order',
                'label' => '반품 가능 기간',
                'description' => '상품 수령 후 반품 가능한 기간 (일)',
            ],

            // 알림 설정
            [
                'key' => 'notification_order_placed',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'notification',
                'label' => '주문 접수 알림',
                'description' => '주문 접수 시 관리자에게 알림 전송',
            ],
            [
                'key' => 'notification_payment_completed',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'notification',
                'label' => '결제 완료 알림',
                'description' => '결제 완료 시 관리자에게 알림 전송',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
