<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create test user if not exists
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'role' => 'user',
            ]
        );

        $this->call([
            AdminSeeder::class,
            ProductCategorySeeder::class,
            ProductSeeder::class,
            CouponSeeder::class,
            UserCouponSeeder::class,
            OrderSeeder::class,
            ReviewSeeder::class,
            PaymentSeeder::class,
            SettingSeeder::class,
            CartSeeder::class,
        ]);
    }
}
