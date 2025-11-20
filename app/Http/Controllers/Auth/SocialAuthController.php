<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class SocialAuthController extends Controller
{
    /**
     * Supported social providers
     */
    private const SUPPORTED_PROVIDERS = ['google', 'kakao', 'naver'];

    /**
     * Redirect to social provider
     */
    public function redirect(string $provider): RedirectResponse
    {
        $this->validateProvider($provider);

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle callback from social provider
     */
    public function callback(string $provider): RedirectResponse
    {
        try {
            $this->validateProvider($provider);

            $socialUser = Socialite::driver($provider)->user();

            $user = $this->findOrCreateUser($provider, $socialUser);

            Auth::login($user, true);

            // Create API token for Sanctum
            $token = $user->createToken('web-app')->plainTextToken;
            session(['api_token' => $token]);

            return redirect()->intended('/');
        } catch (Exception $e) {
            return redirect()->route('login')
                ->withErrors(['social' => '소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.']);
        }
    }

    /**
     * Find or create user from social provider
     */
    private function findOrCreateUser(string $provider, $socialUser): User
    {
        // Check if user already exists with this provider
        $existingUser = User::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($existingUser) {
            // Update avatar if changed
            if ($existingUser->avatar !== $socialUser->getAvatar()) {
                $existingUser->update(['avatar' => $socialUser->getAvatar()]);
            }
            return $existingUser;
        }

        // Check if user exists with same email
        $emailUser = User::where('email', $socialUser->getEmail())->first();

        if ($emailUser) {
            // Link social account to existing email user
            $emailUser->update([
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'avatar' => $socialUser->getAvatar(),
            ]);
            return $emailUser;
        }

        // Create new user
        return User::create([
            'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
            'email' => $socialUser->getEmail(),
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'avatar' => $socialUser->getAvatar(),
            'password' => Hash::make(Str::random(24)), // Random password for social users
            'email_verified_at' => now(), // Auto-verify social login emails
        ]);
    }

    /**
     * Validate provider
     */
    private function validateProvider(string $provider): void
    {
        if (!in_array($provider, self::SUPPORTED_PROVIDERS)) {
            abort(404, 'Provider not supported');
        }
    }
}
