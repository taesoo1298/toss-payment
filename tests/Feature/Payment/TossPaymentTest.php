<?php

namespace Tests\Feature\Payment;

use App\Enums\Payment\PaymentMethod;
use App\Enums\Payment\PaymentStatus;
use App\Models\Payment;
use App\Models\User;
use App\Services\Payment\TossApiClient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TossPaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    /** @test */
    public function it_can_prepare_payment()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/prepare', [
                'order_name' => 'Test Order',
                'amount' => 10000,
                'method' => PaymentMethod::CARD->value,
                'customer_name' => 'Test User',
                'customer_email' => 'test@example.com',
            ]);

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'order_id',
                    'order_name',
                    'amount',
                    'customer_name',
                    'customer_email',
                    'success_url',
                    'fail_url',
                ],
            ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $this->user->id,
            'order_name' => 'Test Order',
            'total_amount' => 10000,
            'status' => PaymentStatus::READY->value,
        ]);
    }

    /** @test */
    public function it_can_confirm_payment()
    {
        // Create a ready payment
        $payment = Payment::factory()->create([
            'user_id' => $this->user->id,
            'status' => PaymentStatus::READY,
            'total_amount' => 10000,
        ]);

        // Mock Toss API response
        Http::fake([
            '*/v1/payments/confirm' => Http::response([
                'paymentKey' => 'test_payment_key_123',
                'orderId' => $payment->order_id,
                'status' => 'DONE',
                'totalAmount' => 10000,
                'balanceAmount' => 10000,
                'approvedAt' => now()->toIso8601String(),
                'receipt' => [
                    'url' => 'https://example.com/receipt',
                ],
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/confirm', [
                'payment_key' => 'test_payment_key_123',
                'order_id' => $payment->order_id,
                'amount' => 10000,
            ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => '결제가 완료되었습니다.',
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'payment_key' => 'test_payment_key_123',
            'status' => PaymentStatus::DONE->value,
        ]);
    }

    /** @test */
    public function it_validates_amount_mismatch_during_confirmation()
    {
        $payment = Payment::factory()->create([
            'user_id' => $this->user->id,
            'status' => PaymentStatus::READY,
            'total_amount' => 10000,
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/confirm', [
                'payment_key' => 'test_payment_key',
                'order_id' => $payment->order_id,
                'amount' => 20000, // Different amount
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    /** @test */
    public function it_can_cancel_payment()
    {
        $payment = Payment::factory()->create([
            'user_id' => $this->user->id,
            'status' => PaymentStatus::DONE,
            'total_amount' => 10000,
            'balance_amount' => 10000,
            'payment_key' => 'test_payment_key',
        ]);

        // Mock Toss API response
        Http::fake([
            '*/v1/payments/*/cancel' => Http::response([
                'paymentKey' => $payment->payment_key,
                'orderId' => $payment->order_id,
                'status' => 'CANCELED',
                'cancels' => [
                    [
                        'cancelAmount' => 10000,
                        'cancelReason' => 'Test cancellation',
                        'canceledAt' => now()->toIso8601String(),
                    ],
                ],
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/payments/{$payment->order_id}/cancel", [
                'cancel_reason' => 'Test cancellation',
            ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'message' => '결제가 취소되었습니다.',
            ]);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => PaymentStatus::CANCELED->value,
        ]);
    }

    /** @test */
    public function it_can_get_payment_details()
    {
        $payment = Payment::factory()->create([
            'user_id' => $this->user->id,
            'status' => PaymentStatus::DONE,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/payments/{$payment->order_id}");

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'order_id',
                    'order_name',
                    'status',
                    'amounts',
                ],
            ]);
    }

    /** @test */
    public function it_requires_authentication_for_protected_routes()
    {
        $response = $this->postJson('/api/payments/prepare', [
            'order_name' => 'Test Order',
            'amount' => 10000,
            'method' => 'card',
        ]);

        $response->assertUnauthorized();
    }

    /** @test */
    public function it_validates_payment_preparation_data()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/payments/prepare', [
                'order_name' => '', // Empty
                'amount' => 50, // Below minimum
                'method' => 'invalid_method',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'order_name',
                'amount',
                'method',
            ]);
    }
}
