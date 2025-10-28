<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class PaymentConfirmRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'payment_key' => ['required', 'string', 'max:200'],
            'order_id' => ['required', 'string', 'max:64'],
            'amount' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'payment_key.required' => '결제 키가 필요합니다.',
            'order_id.required' => '주문 ID가 필요합니다.',
            'amount.required' => '결제 금액이 필요합니다.',
            'amount.min' => '결제 금액은 1원 이상이어야 합니다.',
        ];
    }
}
