<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AccountSettingController extends Controller
{
    /**
     * Display account settings page
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('MyPage/AccountSettings', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'profilePublic' => $user->profile_public ?? false,
                'showEmailPublic' => $user->show_email_public ?? false,
                'showPhonePublic' => $user->show_phone_public ?? false,
                'allowPersonalizedAds' => $user->allow_personalized_ads ?? true,
                'allowThirdPartySharing' => $user->allow_third_party_sharing ?? false,
                'twoFactorEnabled' => $user->two_factor_enabled ?? false,
                'twoFactorMethod' => $user->two_factor_method,
                'lastLoginAt' => $user->last_login_at?->format('Y-m-d H:i:s'),
                'createdAt' => $user->created_at->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Update profile information
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => '프로필이 업데이트되었습니다.',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
        ]);
    }

    /**
     * Update password
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = $request->user();

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => '현재 비밀번호가 일치하지 않습니다.',
                'errors' => [
                    'current_password' => ['현재 비밀번호가 일치하지 않습니다.'],
                ],
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => '비밀번호가 변경되었습니다.',
        ]);
    }

    /**
     * Update privacy settings
     */
    public function updatePrivacy(Request $request)
    {
        $validated = $request->validate([
            'profile_public' => 'sometimes|boolean',
            'show_email_public' => 'sometimes|boolean',
            'show_phone_public' => 'sometimes|boolean',
            'allow_personalized_ads' => 'sometimes|boolean',
            'allow_third_party_sharing' => 'sometimes|boolean',
        ]);

        $request->user()->update($validated);

        return response()->json([
            'message' => '개인정보 설정이 업데이트되었습니다.',
        ]);
    }

    /**
     * Enable two-factor authentication
     */
    public function enableTwoFactor(Request $request)
    {
        $validated = $request->validate([
            'method' => 'required|in:sms,email,app',
        ]);

        $user = $request->user();

        // TODO: Implement actual 2FA setup flow
        // 1. Generate secret key
        // 2. Send verification code
        // 3. Verify code before enabling

        $user->update([
            'two_factor_enabled' => true,
            'two_factor_method' => $validated['method'],
        ]);

        return response()->json([
            'message' => '2단계 인증이 활성화되었습니다.',
        ]);
    }

    /**
     * Disable two-factor authentication
     */
    public function disableTwoFactor(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        // Verify password
        if (!Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => '비밀번호가 일치하지 않습니다.',
            ], 422);
        }

        $user->update([
            'two_factor_enabled' => false,
            'two_factor_method' => null,
        ]);

        return response()->json([
            'message' => '2단계 인증이 비활성화되었습니다.',
        ]);
    }

    /**
     * Request account deletion
     */
    public function deleteAccount(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|string',
            'reason' => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        // Verify password
        if (!Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => '비밀번호가 일치하지 않습니다.',
            ], 422);
        }

        // TODO: Implement account deletion workflow
        // 1. Mark account for deletion (soft delete or flag)
        // 2. Send confirmation email
        // 3. Schedule permanent deletion after grace period (e.g., 30 days)
        // 4. Cancel any active subscriptions/orders

        $user->update([
            'account_active' => false,
            'account_suspended_at' => now(),
            'suspension_reason' => 'user_requested_deletion: ' . ($validated['reason'] ?? ''),
        ]);

        // Logout user
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => '계정 삭제가 요청되었습니다. 30일 후 영구 삭제됩니다.',
        ]);
    }

    /**
     * Download user data (GDPR compliance)
     */
    public function downloadData(Request $request)
    {
        $user = $request->user();

        // TODO: Implement data export
        // 1. Gather all user data (orders, reviews, addresses, etc.)
        // 2. Generate JSON/CSV file
        // 3. Return downloadable file or send via email

        return response()->json([
            'message' => '데이터 다운로드 요청이 접수되었습니다. 이메일로 발송됩니다.',
        ]);
    }
}
