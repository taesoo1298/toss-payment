<?php

namespace App\Enums\Payment;

enum PaymentMethod: string
{
    case CARD = 'card';                     // 카드
    case VIRTUAL_ACCOUNT = 'virtual_account'; // 가상계좌
    case TRANSFER = 'transfer';             // 계좌이체
    case MOBILE_PHONE = 'mobile_phone';     // 휴대폰
    case CULTURE_GIFT_CERTIFICATE = 'culture_gift_certificate'; // 문화상품권
    case BOOK_GIFT_CERTIFICATE = 'book_gift_certificate';       // 도서문화상품권
    case GAME_GIFT_CERTIFICATE = 'game_gift_certificate';       // 게임문화상품권
    case EASY_PAY = 'easy_pay';            // 간편결제 (토스페이, 네이버페이 등)

    public function label(): string
    {
        return match($this) {
            self::CARD => '카드',
            self::VIRTUAL_ACCOUNT => '가상계좌',
            self::TRANSFER => '계좌이체',
            self::MOBILE_PHONE => '휴대폰',
            self::CULTURE_GIFT_CERTIFICATE => '문화상품권',
            self::BOOK_GIFT_CERTIFICATE => '도서문화상품권',
            self::GAME_GIFT_CERTIFICATE => '게임문화상품권',
            self::EASY_PAY => '간편결제',
        };
    }

    public function requiresDeposit(): bool
    {
        return $this === self::VIRTUAL_ACCOUNT;
    }

    public function isInstantPayment(): bool
    {
        return in_array($this, [
            self::CARD,
            self::TRANSFER,
            self::EASY_PAY,
            self::MOBILE_PHONE,
        ]);
    }
}
