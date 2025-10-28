<?php

namespace App\Enums\Payment;

enum PaymentStatus: string
{
    case PENDING = 'pending';           // 결제 대기
    case READY = 'ready';               // 결제 준비 완료
    case IN_PROGRESS = 'in_progress';   // 결제 진행중
    case WAITING_FOR_DEPOSIT = 'waiting_for_deposit'; // 입금 대기 (가상계좌)
    case DONE = 'done';                 // 결제 완료
    case CANCELED = 'canceled';         // 결제 취소
    case PARTIAL_CANCELED = 'partial_canceled'; // 부분 취소
    case ABORTED = 'aborted';          // 결제 승인 실패
    case EXPIRED = 'expired';          // 결제 만료

    public function label(): string
    {
        return match($this) {
            self::PENDING => '결제 대기',
            self::READY => '결제 준비 완료',
            self::IN_PROGRESS => '결제 진행중',
            self::WAITING_FOR_DEPOSIT => '입금 대기',
            self::DONE => '결제 완료',
            self::CANCELED => '결제 취소',
            self::PARTIAL_CANCELED => '부분 취소',
            self::ABORTED => '결제 실패',
            self::EXPIRED => '결제 만료',
        };
    }

    public function isCompleted(): bool
    {
        return $this === self::DONE;
    }

    public function isCanceled(): bool
    {
        return in_array($this, [self::CANCELED, self::PARTIAL_CANCELED]);
    }

    public function isFailed(): bool
    {
        return in_array($this, [self::ABORTED, self::EXPIRED]);
    }
}
