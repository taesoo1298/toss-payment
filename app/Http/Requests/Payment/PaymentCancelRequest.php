<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class PaymentCancelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // 추가적인 권한 체크 (예: 결제한 사용자 본인인지 확인)
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'cancel_reason' => ['required', 'string', 'max:200'],
            'cancel_amount' => ['nullable', 'integer', 'min:1'],
            'refundable_amount' => ['nullable', 'integer', 'min:0'],
            'tax_free_amount' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'cancel_reason.required' => '취소 사유는 필수입니다.',
            'cancel_reason.max' => '취소 사유는 최대 200자까지 입력 가능합니다.',
            'cancel_amount.min' => '취소 금액은 1원 이상이어야 합니다.',
        ];
    }
}
