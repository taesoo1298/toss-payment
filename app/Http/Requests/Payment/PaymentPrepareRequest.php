<?php

namespace App\Http\Requests\Payment;

use App\Enums\Payment\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentPrepareRequest extends FormRequest
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
            'order_name' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'integer', 'min:100', 'max:10000000'],
            'method' => ['required', Rule::enum(PaymentMethod::class)],
            'customer_name' => ['nullable', 'string', 'max:100'],
            'customer_email' => ['nullable', 'email', 'max:100'],
            'customer_mobile_phone' => ['nullable', 'string', 'regex:/^01[0-9]{8,9}$/'],
            'tax_free_amount' => ['nullable', 'integer', 'min:0'],
            'discount_amount' => ['nullable', 'integer', 'min:0'],
            'metadata' => ['nullable', 'array'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'order_name.required' => '주문명은 필수입니다.',
            'order_name.max' => '주문명은 최대 100자까지 입력 가능합니다.',
            'amount.required' => '결제 금액은 필수입니다.',
            'amount.min' => '최소 결제 금액은 100원입니다.',
            'amount.max' => '최대 결제 금액은 1,000만원입니다.',
            'method.required' => '결제 수단을 선택해주세요.',
            'customer_email.email' => '올바른 이메일 형식이 아닙니다.',
            'customer_mobile_phone.regex' => '올바른 휴대폰 번호 형식이 아닙니다.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // 금액 계산 검증
        if ($this->has(['amount', 'tax_free_amount'])) {
            $taxableAmount = $this->amount - ($this->tax_free_amount ?? 0);

            $this->merge([
                'supplied_amount' => (int) ($taxableAmount / 1.1),
                'vat' => (int) ($taxableAmount - ($taxableAmount / 1.1)),
            ]);
        }
    }
}
