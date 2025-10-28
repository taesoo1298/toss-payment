<?php

namespace App\Repositories\Payment;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PaymentRepository
{
    /**
     * Create a new payment.
     */
    public function create(array $data): Payment
    {
        return Payment::create($data);
    }

    /**
     * Find payment by ID.
     */
    public function find(int $id): ?Payment
    {
        return Payment::with('transactions')->find($id);
    }

    /**
     * Find payment by order ID.
     */
    public function findByOrderId(string $orderId): ?Payment
    {
        return Payment::where('order_id', $orderId)->first();
    }

    /**
     * Find payment by payment key.
     */
    public function findByPaymentKey(string $paymentKey): ?Payment
    {
        return Payment::where('payment_key', $paymentKey)->first();
    }

    /**
     * Get user's payments with pagination.
     */
    public function getUserPayments(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Payment::where('user_id', $userId)
            ->with('transactions')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * Get completed payments.
     */
    public function getCompletedPayments(array $filters = []): Collection
    {
        $query = Payment::completed();

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['from_date'])) {
            $query->where('approved_at', '>=', $filters['from_date']);
        }

        if (isset($filters['to_date'])) {
            $query->where('approved_at', '<=', $filters['to_date']);
        }

        return $query->get();
    }

    /**
     * Get pending payments.
     */
    public function getPendingPayments(): Collection
    {
        return Payment::pending()
            ->where('created_at', '>=', now()->subHours(24))
            ->get();
    }

    /**
     * Get failed payments.
     */
    public function getFailedPayments(): Collection
    {
        return Payment::failed()
            ->where('created_at', '>=', now()->subDays(7))
            ->get();
    }

    /**
     * Update payment.
     */
    public function update(Payment $payment, array $data): bool
    {
        return $payment->update($data);
    }

    /**
     * Delete payment (soft delete).
     */
    public function delete(Payment $payment): bool
    {
        return $payment->delete();
    }

    /**
     * Get payment statistics.
     */
    public function getStatistics(array $filters = []): array
    {
        $query = Payment::query();

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['from_date'])) {
            $query->where('created_at', '>=', $filters['from_date']);
        }

        if (isset($filters['to_date'])) {
            $query->where('created_at', '<=', $filters['to_date']);
        }

        return [
            'total_count' => (clone $query)->count(),
            'completed_count' => (clone $query)->completed()->count(),
            'pending_count' => (clone $query)->pending()->count(),
            'failed_count' => (clone $query)->failed()->count(),
            'total_amount' => (clone $query)->completed()->sum('total_amount'),
            'cancel_amount' => (clone $query)->completed()->sum('cancel_amount'),
        ];
    }
}
