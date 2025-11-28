<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@drsmile.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create super admin user
        \App\Models\User::firstOrCreate(
            ['email' => 'superadmin@drsmile.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('super123'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admin users created successfully!');
        $this->command->info('Admin: admin@drsmile.com / admin123');
        $this->command->info('Super Admin: superadmin@drsmile.com / super123');
    }
}
