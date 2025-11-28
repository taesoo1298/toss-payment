<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Coupon;
use App\Models\UserCoupon;
use Illuminate\Database\Seeder;

class UserCouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get test user
        $user = User::where('email', 'test@example.com')->first();

        if (!$user) {
            $this->command->warn('Test user not found. Run DatabaseSeeder first.');
            return;
        }

        // Get all active coupons
        $coupons = Coupon::where('is_active', true)
            ->where('valid_until', '>=', now())
            ->get();

        if ($coupons->isEmpty()) {
            $this->command->warn('No active coupons found. Run CouponSeeder first.');
            return;
        }

        // Assign first 3 coupons to test user as available
        foreach ($coupons->take(3) as $coupon) {
            UserCoupon::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'coupon_id' => $coupon->id,
                ],
                [
                    'status' => 'available',
                    'issued_at' => now()->subDays(rand(1, 10)),
                ]
            );
        }

        // Assign one more as used (if there are more coupons)
        if ($coupons->count() > 3) {
            $usedCoupon = $coupons->get(3);
            UserCoupon::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'coupon_id' => $usedCoupon->id,
                ],
                [
                    'status' => 'used',
                    'issued_at' => now()->subDays(20),
                    'used_at' => now()->subDays(15),
                ]
            );
        }

        // Get expired coupon (if exists)
        $expiredCoupon = Coupon::where('valid_until', '<', now())->first();
        if ($expiredCoupon) {
            UserCoupon::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'coupon_id' => $expiredCoupon->id,
                ],
                [
                    'status' => 'expired',
                    'issued_at' => now()->subDays(30),
                ]
            );
        }

        $this->command->info('UserCoupon seeder completed successfully.');
    }
}
