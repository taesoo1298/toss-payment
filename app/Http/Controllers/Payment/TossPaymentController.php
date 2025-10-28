<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\PaymentCancelRequest;
use App\Http\Requests\Payment\PaymentConfirmRequest;
use App\Http\Requests\Payment\PaymentPrepareRequest;
use App\Http\Resources\Payment\PaymentResource;
use App\Services\Payment\TossPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TossPaymentController extends Controller
{
    public function __construct(
        private TossPaymentService $paymentService
    ) {}

    /**
     * Prepare payment and return order information.
     *
     * @group Payment
     */
    public function prepare(PaymentPrepareRequest $request): JsonResponse
    {
        try {
            $data = $this->paymentService->prepare($request->validated());

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            Log::error('Payment preparation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => '결제 준비 중 오류가 발생했습니다.',
            ], 500);
        }
    }

    /**
     * Confirm payment after user authentication.
     *
     * @group Payment
     */
    public function confirm(PaymentConfirmRequest $request): JsonResponse
    {
        try {
            $payment = $this->paymentService->confirm($request->validated());

            return response()->json([
                'success' => true,
                'data' => new PaymentResource($payment),
                'message' => '결제가 완료되었습니다.',
            ]);

        } catch (\Exception $e) {
            Log::error('Payment confirmation failed', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Handle success redirect from Toss Payments.
     *
     * @group Payment
     */
    public function success(Request $request)
    {
        $paymentKey = $request->query('paymentKey');
        $orderId = $request->query('orderId');
        $amount = $request->query('amount');

        // For SPA applications, you might want to redirect to frontend
        // return redirect()->to(config('app.frontend_url') . '/payment/success?' . http_build_query([
        //     'paymentKey' => $paymentKey,
        //     'orderId' => $orderId,
        //     'amount' => $amount,
        // ]));

        return view('payment.success', compact('paymentKey', 'orderId', 'amount'));
    }

    /**
     * Handle fail redirect from Toss Payments.
     *
     * @group Payment
     */
    public function fail(Request $request)
    {
        $code = $request->query('code');
        $message = $request->query('message');
        $orderId = $request->query('orderId');

        Log::warning('Payment failed', [
            'order_id' => $orderId,
            'code' => $code,
            'message' => $message,
        ]);

        // For SPA applications
        // return redirect()->to(config('app.frontend_url') . '/payment/fail?' . http_build_query([
        //     'code' => $code,
        //     'message' => $message,
        //     'orderId' => $orderId,
        // ]));

        return view('payment.fail', compact('code', 'message', 'orderId'));
    }

    /**
     * Get payment details.
     *
     * @group Payment
     */
    public function show(string $orderId): JsonResponse
    {
        try {
            $payment = $this->paymentService->getPaymentByOrderId($orderId);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => '결제 정보를 찾을 수 없습니다.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new PaymentResource($payment),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '결제 정보 조회 중 오류가 발생했습니다.',
            ], 500);
        }
    }

    /**
     * Cancel payment.
     *
     * @group Payment
     */
    public function cancel(
        string $orderId,
        PaymentCancelRequest $request
    ): JsonResponse {
        try {
            $payment = $this->paymentService->getPaymentByOrderId($orderId);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => '결제 정보를 찾을 수 없습니다.',
                ], 404);
            }

            // Authorization check
            if ($payment->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => '권한이 없습니다.',
                ], 403);
            }

            $payment = $this->paymentService->cancel($payment, $request->validated());

            return response()->json([
                'success' => true,
                'data' => new PaymentResource($payment),
                'message' => '결제가 취소되었습니다.',
            ]);

        } catch (\Exception $e) {
            Log::error('Payment cancellation failed', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get user's payment history.
     *
     * @group Payment
     */
    public function index(Request $request): JsonResponse
    {
        $payments = $this->paymentService->getUserPayments(
            auth()->id(),
            $request->input('per_page', 15)
        );

        return response()->json([
            'success' => true,
            'data' => PaymentResource::collection($payments),
        ]);
    }
}
