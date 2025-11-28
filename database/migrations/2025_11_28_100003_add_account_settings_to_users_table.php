<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Profile visibility
            $table->boolean('profile_public')->default(false)->after('remember_token');
            $table->boolean('show_email_public')->default(false)->after('profile_public');
            $table->boolean('show_phone_public')->default(false)->after('show_email_public');

            // Privacy settings
            $table->boolean('allow_personalized_ads')->default(true)->after('show_phone_public');
            $table->boolean('allow_third_party_sharing')->default(false)->after('allow_personalized_ads');

            // Account status
            $table->boolean('account_active')->default(true)->after('allow_third_party_sharing');
            $table->timestamp('account_suspended_at')->nullable()->after('account_active');
            $table->string('suspension_reason')->nullable()->after('account_suspended_at');

            // Two-factor authentication
            $table->boolean('two_factor_enabled')->default(false)->after('suspension_reason');
            $table->string('two_factor_method')->nullable()->after('two_factor_enabled'); // sms, email, app

            // Last activity tracking
            $table->timestamp('last_login_at')->nullable()->after('two_factor_method');
            $table->string('last_login_ip')->nullable()->after('last_login_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'profile_public',
                'show_email_public',
                'show_phone_public',
                'allow_personalized_ads',
                'allow_third_party_sharing',
                'account_active',
                'account_suspended_at',
                'suspension_reason',
                'two_factor_enabled',
                'two_factor_method',
                'last_login_at',
                'last_login_ip',
            ]);
        });
    }
};
