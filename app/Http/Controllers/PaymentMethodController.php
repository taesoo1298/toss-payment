<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    /**
     * Display user's payment methods page
     */
    public function index(Request $request)
    {
        $paymentMethods = PaymentMethod::where('user_id', $request->user()->id)
            ->where('is_active', true)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($method) {
                return [
                    'id' => $method->id,
                    'type' => $method->type,
                    'displayName' => $method->display_name,
                    'isDefault' => $method->is_default,
                    'isExpired' => $method->isBillingKeyExpired(),

                    // Card info
                    'cardCompany' => $method->card_company,
                    'cardNumber' => $method->card_number_masked,
                    'cardNickname' => $method->card_nickname,

                    // Bank info
                    'bankName' => $method->bank_name,
                    'accountNumber' => $method->account_number_masked,
                    'accountHolder' => $method->account_holder,

                    // Easy pay info
                    'easyPayProvider' => $method->easy_pay_provider,

                    'createdAt' => $method->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('MyPage/PaymentMethods', [
            'paymentMethods' => $paymentMethods,
        ]);
    }

    /**
     * Get user's payment methods (API)
     */
    public function list(Request $request)
    {
        $paymentMethods = PaymentMethod::where('user_id', $request->user()->id)
            ->where('is_active', true)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($method) {
                return [
                    'id' => $method->id,
                    'type' => $method->type,
                    'displayName' => $method->display_name,
                    'isDefault' => $method->is_default,
                ];
            });

        return response()->json(['paymentMethods' => $paymentMethods]);
    }

    /**
     * Store new payment method
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:card,bank,easy_pay',
            'card_company' => 'required_if:type,card|string|max:50',
            'card_number_masked' => 'required_if:type,card|string|max:50',
            'card_nickname' => 'nullable|string|max:50',
            'bank_name' => 'required_if:type,bank|string|max:50',
            'account_number_masked' => 'required_if:type,bank|string|max:50',
            'account_holder' => 'required_if:type,bank|string|max:50',
            'easy_pay_provider' => 'required_if:type,easy_pay|string|max:50',
            'billing_key' => 'nullable|string',
            'is_default' => 'sometimes|boolean',
        ]);

        $data = $request->only([
            'type',
            'card_company',
            'card_number_masked',
            'card_nickname',
            'bank_name',
            'account_number_masked',
            'account_holder',
            'easy_pay_provider',
            'billing_key',
        ]);

        $data['user_id'] = $request->user()->id;

        // If this is the first payment method or is_default is true
        $hasPaymentMethods = PaymentMethod::where('user_id', $request->user()->id)
            ->where('is_active', true)
            ->exists();

        if ($request->boolean('is_default') || !$hasPaymentMethods) {
            // Remove default from other methods
            PaymentMethod::where('user_id', $request->user()->id)
                ->update(['is_default' => false]);
            $data['is_default'] = true;
        } else {
            $data['is_default'] = false;
        }

        $paymentMethod = PaymentMethod::create($data);

        return response()->json([
            'message' => '결제 수단이 등록되었습니다.',
            'paymentMethod' => [
                'id' => $paymentMethod->id,
                'type' => $paymentMethod->type,
                'displayName' => $paymentMethod->display_name,
            ],
        ], 201);
    }

    /**
     * Update payment method
     */
    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        // Verify ownership
        if ($paymentMethod->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'card_nickname' => 'nullable|string|max:50',
            'is_default' => 'sometimes|boolean',
        ]);

        if ($request->has('card_nickname')) {
            $paymentMethod->card_nickname = $request->card_nickname;
        }

        if ($request->boolean('is_default')) {
            $paymentMethod->setAsDefault();
        }

        $paymentMethod->save();

        return response()->json([
            'message' => '결제 수단이 수정되었습니다.',
            'paymentMethod' => [
                'id' => $paymentMethod->id,
                'displayName' => $paymentMethod->display_name,
            ],
        ]);
    }

    /**
     * Set payment method as default
     */
    public function setDefault(Request $request, PaymentMethod $paymentMethod)
    {
        // Verify ownership
        if ($paymentMethod->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $paymentMethod->setAsDefault();

        return response()->json([
            'message' => '기본 결제 수단으로 설정되었습니다.',
        ]);
    }

    /**
     * Delete payment method (soft delete)
     */
    public function destroy(Request $request, PaymentMethod $paymentMethod)
    {
        // Verify ownership
        if ($paymentMethod->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        // If this is the default payment method, warn user
        if ($paymentMethod->is_default) {
            $otherMethods = PaymentMethod::where('user_id', $request->user()->id)
                ->where('id', '!=', $paymentMethod->id)
                ->where('is_active', true)
                ->exists();

            if ($otherMethods) {
                return response()->json([
                    'message' => '기본 결제 수단은 삭제할 수 없습니다. 다른 결제 수단을 기본으로 설정한 후 삭제해주세요.',
                ], 422);
            }
        }

        $paymentMethod->delete();

        return response()->json([
            'message' => '결제 수단이 삭제되었습니다.',
        ]);
    }
}
