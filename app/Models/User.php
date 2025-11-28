<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'provider',
        'provider_id',
        'avatar',
        'role',
        'is_admin',
        // Account settings
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
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'profile_public' => 'boolean',
            'show_email_public' => 'boolean',
            'show_phone_public' => 'boolean',
            'allow_personalized_ads' => 'boolean',
            'allow_third_party_sharing' => 'boolean',
            'account_active' => 'boolean',
            'account_suspended_at' => 'datetime',
            'two_factor_enabled' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Check if user is an admin (admin or super_admin)
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'super_admin']);
    }

    /**
     * Check if user is a super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Get user's orders
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get user's addresses
     */
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Get user's coupons
     */
    public function userCoupons()
    {
        return $this->hasMany(UserCoupon::class);
    }

    /**
     * Get user's wishlist items
     */
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Get user's cart
     */
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    /**
     * Get user's payment methods
     */
    public function paymentMethods()
    {
        return $this->hasMany(PaymentMethod::class);
    }

    /**
     * Get user's notification settings
     */
    public function notificationSettings()
    {
        return $this->hasOne(NotificationSetting::class);
    }

    /**
     * Get user's inquiries
     */
    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }

    /**
     * Get inquiries answered by this user (admin)
     */
    public function answeredInquiries()
    {
        return $this->hasMany(Inquiry::class, 'answered_by');
    }

    /**
     * Get notices created by this user (admin)
     */
    public function notices()
    {
        return $this->hasMany(Notice::class, 'author_id');
    }
}
