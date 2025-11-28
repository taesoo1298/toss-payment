<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first user for member cart (create if doesn't exist)
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
        }

        // Get some products (assuming products exist)
        $products = Product::limit(5)->get();

        if ($products->count() === 0) {
            $this->command->warn('No products found. Please run ProductSeeder first.');
            return;
        }

        // Create member cart
        $memberCart = Cart::create([
            'user_id' => $user->id,
            'session_id' => null,
            'total_items' => 0,
            'subtotal' => 0,
            'discount' => 0,
            'total' => 0,
            'last_activity_at' => now(),
        ]);

        // Add items to member cart
        foreach ($products->take(3) as $index => $product) {
            $quantity = $index + 1;
            $discount = $product->original_price ? ($product->original_price - $product->price) : 0;

            CartItem::create([
                'cart_id' => $memberCart->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price,
                'discount' => $discount,
                'total' => $product->price * $quantity,
            ]);
        }

        // Recalculate member cart totals
        $memberCart->recalculateTotals();

        // Create guest cart
        $guestCart = Cart::create([
            'user_id' => null,
            'session_id' => Str::random(40),
            'total_items' => 0,
            'subtotal' => 0,
            'discount' => 0,
            'total' => 0,
            'last_activity_at' => now(),
        ]);

        // Add items to guest cart
        foreach ($products->skip(2)->take(2) as $index => $product) {
            $quantity = 1;
            $discount = $product->original_price ? ($product->original_price - $product->price) : 0;

            CartItem::create([
                'cart_id' => $guestCart->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price,
                'discount' => $discount,
                'total' => $product->price * $quantity,
            ]);
        }

        // Recalculate guest cart totals
        $guestCart->recalculateTotals();

        $this->command->info('Cart seeder completed!');
        $this->command->info("Created member cart (user_id: {$user->id}) with {$memberCart->total_items} items");
        $this->command->info("Created guest cart (session_id: {$guestCart->session_id}) with {$guestCart->total_items} items");
    }
}
