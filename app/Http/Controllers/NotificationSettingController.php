<?php

namespace App\Http\Controllers;

use App\Models\NotificationSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationSettingController extends Controller
{
    /**
     * Display notification settings page
     */
    public function index(Request $request)
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        return Inertia::render('MyPage/Notifications', [
            'settings' => [
                'emailOrderUpdates' => $settings->email_order_updates,
                'emailPromotions' => $settings->email_promotions,
                'emailNewsletter' => $settings->email_newsletter,
                'emailProductRestock' => $settings->email_product_restock,
                'smsOrderUpdates' => $settings->sms_order_updates,
                'smsPromotions' => $settings->sms_promotions,
                'pushOrderUpdates' => $settings->push_order_updates,
                'pushPromotions' => $settings->push_promotions,
                'pushProductRestock' => $settings->push_product_restock,
                'pushReviewReminders' => $settings->push_review_reminders,
                'marketingEmailConsent' => $settings->marketing_email_consent,
                'marketingSmsConsent' => $settings->marketing_sms_consent,
                'marketingConsentDate' => $settings->marketing_consent_date?->format('Y-m-d H:i:s'),
                'doNotDisturbEnabled' => $settings->do_not_disturb_enabled,
                'doNotDisturbStart' => $settings->do_not_disturb_start,
                'doNotDisturbEnd' => $settings->do_not_disturb_end,
            ],
        ]);
    }

    /**
     * Get user's notification settings (API)
     */
    public function show(Request $request)
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        return response()->json(['settings' => $settings]);
    }

    /**
     * Update notification settings
     */
    public function update(Request $request)
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        $validated = $request->validate([
            'email_order_updates' => 'sometimes|boolean',
            'email_promotions' => 'sometimes|boolean',
            'email_newsletter' => 'sometimes|boolean',
            'email_product_restock' => 'sometimes|boolean',
            'sms_order_updates' => 'sometimes|boolean',
            'sms_promotions' => 'sometimes|boolean',
            'push_order_updates' => 'sometimes|boolean',
            'push_promotions' => 'sometimes|boolean',
            'push_product_restock' => 'sometimes|boolean',
            'push_review_reminders' => 'sometimes|boolean',
            'marketing_email_consent' => 'sometimes|boolean',
            'marketing_sms_consent' => 'sometimes|boolean',
            'do_not_disturb_enabled' => 'sometimes|boolean',
            'do_not_disturb_start' => 'sometimes|date_format:H:i',
            'do_not_disturb_end' => 'sometimes|date_format:H:i',
        ]);

        // Update marketing consent date if marketing settings changed
        if (isset($validated['marketing_email_consent']) || isset($validated['marketing_sms_consent'])) {
            $validated['marketing_consent_date'] = now();
        }

        $settings->update($validated);

        return response()->json([
            'message' => '알림 설정이 저장되었습니다.',
            'settings' => $settings->fresh(),
        ]);
    }

    /**
     * Update specific notification category
     */
    public function updateCategory(Request $request, string $category)
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        $validated = $request->validate([
            'enabled' => 'required|boolean',
        ]);

        $field = $this->getCategoryField($category);

        if (!$field) {
            return response()->json([
                'message' => '유효하지 않은 알림 카테고리입니다.',
            ], 422);
        }

        $settings->update([$field => $validated['enabled']]);

        return response()->json([
            'message' => '알림 설정이 업데이트되었습니다.',
        ]);
    }

    /**
     * Update marketing consent
     */
    public function updateMarketingConsent(Request $request)
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        $validated = $request->validate([
            'email_consent' => 'required|boolean',
            'sms_consent' => 'required|boolean',
        ]);

        $settings->updateMarketingConsent(
            $validated['email_consent'],
            $validated['sms_consent']
        );

        return response()->json([
            'message' => '마케팅 수신 동의가 업데이트되었습니다.',
        ]);
    }

    /**
     * Update do not disturb settings
     */
    public function updateDoNotDisturb(Request $request)
    {
        $settings = $this->getOrCreateSettings($request->user()->id);

        $validated = $request->validate([
            'enabled' => 'required|boolean',
            'start_time' => 'required_if:enabled,true|date_format:H:i',
            'end_time' => 'required_if:enabled,true|date_format:H:i',
        ]);

        $settings->update([
            'do_not_disturb_enabled' => $validated['enabled'],
            'do_not_disturb_start' => $validated['start_time'] ?? '22:00',
            'do_not_disturb_end' => $validated['end_time'] ?? '08:00',
        ]);

        return response()->json([
            'message' => '방해 금지 모드가 업데이트되었습니다.',
        ]);
    }

    /**
     * Get or create notification settings for user
     */
    private function getOrCreateSettings(int $userId): NotificationSetting
    {
        return NotificationSetting::firstOrCreate(
            ['user_id' => $userId],
            [
                'email_order_updates' => true,
                'email_promotions' => true,
                'email_newsletter' => false,
                'email_product_restock' => true,
                'sms_order_updates' => true,
                'sms_promotions' => false,
                'push_order_updates' => true,
                'push_promotions' => false,
                'push_product_restock' => true,
                'push_review_reminders' => true,
            ]
        );
    }

    /**
     * Map category string to database field
     */
    private function getCategoryField(string $category): ?string
    {
        $mapping = [
            'email-order' => 'email_order_updates',
            'email-promotions' => 'email_promotions',
            'email-newsletter' => 'email_newsletter',
            'email-restock' => 'email_product_restock',
            'sms-order' => 'sms_order_updates',
            'sms-promotions' => 'sms_promotions',
            'push-order' => 'push_order_updates',
            'push-promotions' => 'push_promotions',
            'push-restock' => 'push_product_restock',
            'push-review' => 'push_review_reminders',
        ];

        return $mapping[$category] ?? null;
    }
}
