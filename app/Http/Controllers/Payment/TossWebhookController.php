<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Jobs\Payment\ProcessTossWebhook;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TossWebhookController extends Controller
{
    /**
     * Handle Toss Payments webhook.
     *
     * Webhook types:
     * - PAYMENT.CONFIRMATION_COMPLETED: 결제 승인 완료
     * - PAYMENT.STATUS_CHANGED: 결제 상태 변경
     * - VIRTUAL_ACCOUNT.DEPOSIT_COMPLETED: 가상계좌 입금 완료
     *
     * @group Webhook
     */
    public function handle(Request $request): JsonResponse
    {
        try {
            $payload = $request->all();

            Log::info('Toss Webhook Received', [
                'event_type' => $payload['eventType'] ?? 'unknown',
                'data' => $payload,
            ]);

            // Dispatch job to process webhook asynchronously
            ProcessTossWebhook::dispatch($payload);

            return response()->json([
                'success' => true,
                'message' => 'Webhook received',
            ]);

        } catch (\Exception $e) {
            Log::error('Webhook processing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Return 200 to prevent Toss from retrying
            return response()->json([
                'success' => false,
                'message' => 'Webhook processing failed',
            ], 200);
        }
    }
}
