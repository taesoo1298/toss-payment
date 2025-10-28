<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyTossWebhookSignature
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!config('toss.webhook.verify_signature')) {
            return $next($request);
        }

        $signature = $request->header('X-Toss-Signature');
        $secret = config('toss.webhook_secret');

        if (!$signature || !$secret) {
            return response()->json([
                'error' => 'Invalid webhook signature',
            ], 401);
        }

        $payload = $request->getContent();
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        if (!hash_equals($expectedSignature, $signature)) {
            \Log::warning('Invalid Toss webhook signature', [
                'expected' => $expectedSignature,
                'received' => $signature,
            ]);

            return response()->json([
                'error' => 'Invalid webhook signature',
            ], 401);
        }

        return $next($request);
    }
}
