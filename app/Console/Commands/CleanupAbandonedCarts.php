<?php

namespace App\Console\Commands;

use App\Models\Cart;
use Illuminate\Console\Command;

class CleanupAbandonedCarts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cart:cleanup {--member-days=30 : Days of inactivity for member carts} {--guest-days=7 : Days of inactivity for guest carts}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up abandoned shopping carts based on inactivity period';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $memberDays = (int) $this->option('member-days');
        $guestDays = (int) $this->option('guest-days');

        $this->info('Starting cart cleanup...');

        // Clean up abandoned member carts
        $memberCartsDeleted = Cart::whereNotNull('user_id')
            ->where('last_activity_at', '<', now()->subDays($memberDays))
            ->delete();

        // Clean up abandoned guest carts
        $guestCartsDeleted = Cart::whereNull('user_id')
            ->whereNotNull('session_id')
            ->where('last_activity_at', '<', now()->subDays($guestDays))
            ->delete();

        $this->info("Cleaned up {$memberCartsDeleted} member cart(s) inactive for over {$memberDays} days.");
        $this->info("Cleaned up {$guestCartsDeleted} guest cart(s) inactive for over {$guestDays} days.");
        $this->info('Cart cleanup completed successfully!');

        return Command::SUCCESS;
    }
}
