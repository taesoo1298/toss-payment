<?php

namespace App\Exceptions\Payment;

use Exception;

class TossPaymentException extends Exception
{
    private string $errorCode;
    private int $httpStatusCode;

    public function __construct(
        string $message = "",
        string $errorCode = "UNKNOWN_ERROR",
        int $httpStatusCode = 500,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);

        $this->errorCode = $errorCode;
        $this->httpStatusCode = $httpStatusCode;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getHttpStatusCode(): int
    {
        return $this->httpStatusCode;
    }

    /**
     * Get user-friendly error message.
     */
    public function getUserMessage(): string
    {
        return match($this->errorCode) {
            'UNAUTHORIZED_KEY' => 'API 키가 유효하지 않습니다.',
            'NOT_FOUND_PAYMENT' => '결제 정보를 찾을 수 없습니다.',
            'ALREADY_PROCESSED_PAYMENT' => '이미 처리된 결제입니다.',
            'PROVIDER_ERROR' => '결제 처리 중 오류가 발생했습니다.',
            'EXCEED_MAX_CARD_INSTALLMENT_PLAN' => '할부 개월 수가 초과되었습니다.',
            'INVALID_REQUEST' => '잘못된 요청입니다.',
            'NOT_ALLOWED_POINT_USE' => '포인트 사용이 불가능합니다.',
            'INVALID_API_KEY' => 'API 키가 유효하지 않습니다.',
            'INVALID_REJECT_CARD' => '카드 사용이 거부되었습니다.',
            'BELOW_MINIMUM_AMOUNT' => '최소 결제 금액 미만입니다.',
            'INVALID_CARD_EXPIRATION' => '카드 유효기간이 만료되었습니다.',
            'INVALID_STOPPED_CARD' => '정지된 카드입니다.',
            'EXCEED_MAX_DAILY_PAYMENT_COUNT' => '일일 결제 한도를 초과했습니다.',
            'NOT_SUPPORTED_INSTALLMENT_PLAN_MERCHANT' => '할부가 지원되지 않는 가맹점입니다.',
            'INVALID_CARD_INSTALLMENT_PLAN' => '할부 개월 수가 유효하지 않습니다.',
            'NOT_SUPPORTED_MONTHLY_INSTALLMENT_PLAN' => '월별 할부가 지원되지 않습니다.',
            'EXCEED_MAX_PAYMENT_AMOUNT' => '최대 결제 금액을 초과했습니다.',
            'INVALID_CARD_LOST_OR_STOLEN' => '분실 또는 도난 카드입니다.',
            'RESTRICTED_TRANSFER_ACCOUNT' => '계좌 이체가 제한되었습니다.',
            'INVALID_CARD_NUMBER' => '카드번호가 유효하지 않습니다.',
            'INVALID_UNREGISTERED_SUBMALL' => '등록되지 않은 서브몰입니다.',
            'NOT_REGISTERED_BUSINESS' => '등록되지 않은 사업자입니다.',
            'EXCEED_MAX_ONE_DAY_WITHDRAW_AMOUNT' => '일일 출금 한도를 초과했습니다.',
            'EXCEED_MAX_ONE_TIME_WITHDRAW_AMOUNT' => '1회 출금 한도를 초과했습니다.',
            'CARD_PROCESSING_ERROR' => '카드 처리 중 오류가 발생했습니다.',
            'EXCEED_MAX_AMOUNT' => '한도를 초과했습니다.',
            'INVALID_ACCOUNT_INFO_RE_REGISTER' => '계좌 정보가 올바르지 않습니다.',
            default => $this->message ?: '결제 처리 중 오류가 발생했습니다.',
        };
    }

    /**
     * Convert exception to array for JSON response.
     */
    public function toArray(): array
    {
        return [
            'error' => true,
            'code' => $this->errorCode,
            'message' => $this->getUserMessage(),
            'detail' => $this->message,
        ];
    }
}
