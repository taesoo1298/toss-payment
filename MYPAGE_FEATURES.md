# MyPage Feature Design Documentation

This document outlines the complete design and implementation of all MyPage features for the Dr.Smile E-Commerce Platform.

## Overview

All MyPage menu items have been fully designed with:

-   ✅ Database migrations
-   ✅ Eloquent models with relationships
-   ✅ Controllers with full CRUD operations
-   ✅ API routes
-   ✅ Integration with User model

## Features Implemented

### 1. Wishlist (찜한 상품)

**Purpose**: Allow users to save favorite products for later

**Database**: `wishlists`

-   `user_id` - Foreign key to users
-   `product_id` - Foreign key to products
-   Unique constraint on (user_id, product_id)

**Model**: `App\Models\Wishlist`

-   Relationships: `user()`, `product()`

**Controller**: `App\Http\Controllers\WishlistController`

**Routes**:

-   Page: `GET /mypage/wishlist` - View wishlist page (WishlistController@index)
-   API:
    -   `GET /api/mypage/wishlist` - Get user's wishlist
    -   `GET /api/mypage/wishlist/check/{productId}` - Check if product is in wishlist
    -   `POST /api/mypage/wishlist` - Add product to wishlist
    -   `POST /api/mypage/wishlist/toggle` - Toggle wishlist status
    -   `DELETE /api/mypage/wishlist/{id}` - Remove from wishlist by ID
    -   `DELETE /api/mypage/wishlist/product/{productId}` - Remove by product ID

**Features**:

-   Add/remove products from wishlist
-   Check if product is in wishlist (for heart icon on product pages)
-   Toggle wishlist with single API call
-   View all wishlist items with product details
-   Display stock status and pricing

---

### 2. Payment Methods (결제 수단)

**Purpose**: Manage saved payment methods for quick checkout

**Database**: `payment_methods`

-   `user_id` - Foreign key to users
-   `type` - enum: card, bank, easy_pay
-   Card info: `card_company`, `card_number_masked`, `card_nickname`
-   Bank info: `bank_name`, `account_number_masked`, `account_holder`
-   Easy pay: `easy_pay_provider` (TOSSPAY, KAKAOPAY, NAVERPAY)
-   `billing_key` - For Toss Payments auto payment
-   `billing_key_expires_at` - Billing key expiration
-   `is_default` - Default payment method flag
-   `is_active` - Soft delete flag

**Model**: `App\Models\PaymentMethod`

-   Relationships: `user()`
-   Methods: `setAsDefault()`, `isBillingKeyExpired()`
-   Attribute: `display_name` - Formatted display name
-   Uses `SoftDeletes` trait

**Controller**: `App\Http\Controllers\PaymentMethodController`

**Routes**:

-   Page: `GET /mypage/payments` - View payment methods page (PaymentMethodController@index)
-   API:
    -   `GET /api/mypage/payment-methods` - Get user's payment methods
    -   `POST /api/mypage/payment-methods` - Add new payment method
    -   `PATCH /api/mypage/payment-methods/{id}` - Update payment method
    -   `POST /api/mypage/payment-methods/{id}/set-default` - Set as default
    -   `DELETE /api/mypage/payment-methods/{id}` - Delete payment method

**Features**:

-   Store multiple payment methods (cards, bank accounts, easy pay)
-   Mask sensitive information (card numbers, account numbers)
-   Set default payment method
-   Manage billing keys for recurring payments
-   Prevent deletion of default payment method if it's the only one
-   Check billing key expiration

---

### 3. Notification Settings (알림 설정)

**Purpose**: Manage email, SMS, and push notification preferences

**Database**: `notification_settings`

-   `user_id` - Foreign key to users (unique)
-   Email notifications: `email_order_updates`, `email_promotions`, `email_newsletter`, `email_product_restock`
-   SMS notifications: `sms_order_updates`, `sms_promotions`
-   Push notifications: `push_order_updates`, `push_promotions`, `push_product_restock`, `push_review_reminders`
-   Marketing consent: `marketing_email_consent`, `marketing_sms_consent`, `marketing_consent_date`
-   Do Not Disturb: `do_not_disturb_enabled`, `do_not_disturb_start`, `do_not_disturb_end`

**Model**: `App\Models\NotificationSetting`

-   Relationships: `user()`
-   Methods:
    -   `updateMarketingConsent()` - Update marketing consent with timestamp
    -   `canReceiveNotification()` - Check if notifications allowed at current time

**Controller**: `App\Http\Controllers\NotificationSettingController`

**Routes**:

-   Page: `GET /mypage/notifications` - View notification settings page (NotificationSettingController@index)
-   API:
    -   `GET /api/mypage/notification-settings` - Get user's settings
    -   `PATCH /api/mypage/notification-settings` - Update all settings
    -   `PATCH /api/mypage/notification-settings/{category}` - Update specific category
    -   `POST /api/mypage/notification-settings/marketing-consent` - Update marketing consent
    -   `POST /api/mypage/notification-settings/do-not-disturb` - Update DND settings

**Features**:

-   Granular control over email, SMS, and push notifications
-   Separate settings for order updates vs promotions
-   Marketing consent tracking with timestamp (legal requirement)
-   Do Not Disturb mode with time range
-   Auto-create settings with sensible defaults
-   Helper to check if notifications can be sent at current time

---

### 4. Account Settings (계정 설정)

**Purpose**: Manage profile, password, privacy, and security settings

**Database**: Added columns to `users` table via migration

-   Privacy: `profile_public`, `show_email_public`, `show_phone_public`, `allow_personalized_ads`, `allow_third_party_sharing`
-   Account status: `account_active`, `account_suspended_at`, `suspension_reason`
-   Two-factor auth: `two_factor_enabled`, `two_factor_method` (sms, email, app)
-   Activity tracking: `last_login_at`, `last_login_ip`

**Controller**: `App\Http\Controllers\AccountSettingController`

**Routes**:

-   Page: `GET /mypage/settings` - View account settings page (AccountSettingController@index)
-   API:
    -   `PATCH /api/mypage/account/profile` - Update profile (name, email, phone)
    -   `POST /api/mypage/account/password` - Update password
    -   `PATCH /api/mypage/account/privacy` - Update privacy settings
    -   `POST /api/mypage/account/two-factor/enable` - Enable 2FA
    -   `POST /api/mypage/account/two-factor/disable` - Disable 2FA
    -   `DELETE /api/mypage/account` - Delete account
    -   `GET /api/mypage/account/download-data` - Download user data (GDPR)

**Features**:

-   Update profile information (name, email, phone)
-   Change password with current password verification
-   Privacy controls (profile visibility, data sharing)
-   Two-factor authentication (SMS, email, app)
-   Account deletion workflow with grace period
-   Data export for GDPR compliance
-   Last login tracking

---

### 5. Customer Center (고객센터)

**Purpose**: FAQ, notices, and 1:1 inquiry system

#### 5.1 FAQ (자주 묻는 질문)

**Database**: `faqs`

-   `category` - 주문/배송, 결제, 회원, 상품, 기타
-   `question`, `answer`
-   `view_count`, `helpful_count` - Engagement metrics
-   `order` - Display order
-   `is_active` - Published status

**Model**: `App\Models\Faq`

-   Methods: `incrementViewCount()`, `markHelpful()`
-   Scopes: `active()`, `byCategory()`, `ordered()`

**Controller**: `App\Http\Controllers\FaqController`

**Routes**:

-   `GET /customer-center/faq` - FAQ page with category filter (FaqController@index)
-   `GET /customer-center/faq/{id}` - View single FAQ
-   `POST /customer-center/faq/{id}/helpful` - Mark FAQ as helpful
-   `GET /customer-center/faq/search` - Search FAQs

**Features**:

-   Category-based organization
-   View count tracking
-   Helpful count voting
-   Search functionality
-   Custom ordering

#### 5.2 Notices (공지사항)

**Database**: `notices`

-   `category` - 공지, 이벤트, 업데이트, 점검
-   `title`, `content`
-   `attachments` - JSON array of file URLs
-   `is_pinned`, `is_important` - Display flags
-   `view_count`
-   `published_at` - Schedule publishing
-   `author_id` - Admin who wrote the notice

**Model**: `App\Models\Notice`

-   Relationships: `author()`
-   Methods: `incrementViewCount()`, `isPublished()`
-   Scopes: `published()`, `pinned()`, `important()`, `byCategory()`, `ordered()`

**Controller**: `App\Http\Controllers\NoticeController`

**Routes**:

-   `GET /customer-center/notices` - Notices page with pagination (NoticeController@index)
-   `GET /customer-center/notices/{id}` - View notice detail with prev/next
-   `GET /customer-center/notices/search` - Search notices

**Features**:

-   Category-based filtering
-   Pinned notices (always on top)
-   Important notice flagging
-   Pagination (20 per page)
-   Previous/Next navigation
-   File attachments support
-   Scheduled publishing
-   View count tracking
-   Search functionality

#### 5.3 Inquiries (1:1 문의)

**Database**: `inquiries`

-   `user_id` - Who created the inquiry
-   `order_id` - Related order (optional)
-   `category` - 주문/배송, 결제, 회원, 상품, 기타
-   `subject`, `content`
-   `attachments` - JSON array of file URLs
-   `status` - pending, answered, closed
-   `answer`, `answered_at`, `answered_by` - Admin response

**Model**: `App\Models\Inquiry`

-   Relationships: `user()`, `order()`, `answeredBy()`
-   Methods: `markAnswered()`, `close()`
-   Scopes: `pending()`, `answered()`, `byCategory()`

**Controller**: `App\Http\Controllers\InquiryController`

**Routes** (Auth required):

-   `GET /customer-center/inquiry` - User's inquiries list (InquiryController@index)
-   `GET /customer-center/inquiry/create` - Create inquiry form ✅ NEW
-   `POST /customer-center/inquiry` - Create new inquiry
-   `GET /customer-center/inquiry/{id}` - View inquiry detail
-   `PATCH /customer-center/inquiry/{id}` - Update inquiry (only if pending)
-   `DELETE /customer-center/inquiry/{id}` - Delete inquiry (only if pending)
-   `POST /customer-center/inquiry/{id}/close` - Close inquiry

**Features**:

-   Status-based filtering
-   Order-related inquiries
-   File attachments support
-   Edit/delete only if not answered
-   Admin response tracking
-   Close inquiry when resolved

---

## Updated Files

### Models

-   `app/Models/Wishlist.php` ✅ NEW
-   `app/Models/PaymentMethod.php` ✅ NEW
-   `app/Models/NotificationSetting.php` ✅ NEW
-   `app/Models/Faq.php` ✅ NEW
-   `app/Models/Inquiry.php` ✅ NEW
-   `app/Models/Notice.php` ✅ NEW
-   `app/Models/User.php` ✅ UPDATED - Added relationships and account settings fields

### Controllers

-   `app/Http/Controllers/WishlistController.php` ✅ NEW
-   `app/Http/Controllers/PaymentMethodController.php` ✅ NEW
-   `app/Http/Controllers/NotificationSettingController.php` ✅ NEW
-   `app/Http/Controllers/AccountSettingController.php` ✅ NEW
-   `app/Http/Controllers/FaqController.php` ✅ NEW
-   `app/Http/Controllers/InquiryController.php` ✅ NEW (updated with create method)
-   `app/Http/Controllers/NoticeController.php` ✅ NEW
-   `app/Http/Controllers/CustomerCenterController.php` ✅ NEW
-   `app/Http/Controllers/MyPageController.php` ✅ UPDATED - Added wishlist count from database

### Migrations

-   `database/migrations/2025_11_28_100000_create_wishlists_table.php` ✅ NEW
-   `database/migrations/2025_11_28_100001_create_payment_methods_table.php` ✅ NEW
-   `database/migrations/2025_11_28_100002_create_notification_settings_table.php` ✅ NEW
-   `database/migrations/2025_11_28_100003_add_account_settings_to_users_table.php` ✅ NEW
-   `database/migrations/2025_11_28_100004_create_faqs_table.php` ✅ NEW
-   `database/migrations/2025_11_28_100005_create_inquiries_table.php` ✅ NEW
-   `database/migrations/2025_11_28_100006_create_notices_table.php` ✅ NEW

### Routes

-   `routes/web.php` ✅ UPDATED - Added all MyPage and Customer Center routes

---

---

## Recent Updates (2025-11-28)

### ✅ Completed Changes

#### 1. MyPage Profile Page Added

-   **Controller**: `App\Http\Controllers\AccountSettingController` (index method serves profile viewing)
-   **Route**: `GET /mypage/settings` → `mypage.settings`
-   **Note**: Profile viewing integrated into Account Settings page instead of separate profile page

#### 2. Customer Center Landing Page

-   **Controller**: `App\Http\Controllers\CustomerCenterController` ✅ NEW
-   **Route**: `GET /customer-center` → `customer-center.index`
-   **Frontend**: `resources/js/Pages/CustomerCenter/Index.tsx` ✅ CREATED
-   **Features**:
    -   Unified landing page with 3 main service cards (FAQ, Notices, Inquiry)
    -   Recent notices (top 5)
    -   Popular FAQs (top 5 by view count)
    -   User's recent inquiries (top 3, if logged in)
    -   FAQ category quick access with counts

#### 3. Inquiry System Enhancements

-   **Route Added**: `GET /customer-center/inquiry/create` → `customer-center.inquiry.create`
-   **Controller Method**: `InquiryController::create()` ✅ ADDED
-   **Frontend**: `resources/js/Pages/CustomerCenter/InquiryCreate.tsx` ✅ CREATED
-   **Features**:
    -   Full inquiry creation form with category selection
    -   Optional order number field for order-related inquiries
    -   Character counter for subject (200 max)
    -   Multi-line content textarea
    -   Success notification with auto-redirect
    -   Help section with FAQ link and business hours
    -   Uses MyPageLayout for consistent UX

#### 4. Route Structure Improvements

-   **Fixed**: FAQ/Notice search routes moved before dynamic {id} routes to prevent conflicts
-   **Fixed**: Duplicate `/profile` route removed
-   **Added**: Customer Center main landing route
-   **Added**: Inquiry create route with proper ordering

---

## Current Status

### ✅ Migrations

All database migrations completed and run successfully.

### ✅ Frontend Pages Status

**MyPage Pages**:

-   `resources/js/Pages/MyPage/Dashboard.tsx` ✅ EXISTS
-   `resources/js/Pages/MyPage/OrderHistory.tsx` ✅ EXISTS
-   `resources/js/Pages/MyPage/Wishlist.tsx` ✅ EXISTS
-   `resources/js/Pages/MyPage/Addresses.tsx` ✅ EXISTS
-   `resources/js/Pages/MyPage/PaymentMethods.tsx` ✅ EXISTS
-   `resources/js/Pages/MyPage/Notifications.tsx` ✅ EXISTS
-   `resources/js/Pages/MyPage/Coupons.tsx` ✅ EXISTS
-   `resources/js/Pages/MyPage/AccountSettings.tsx` ✅ EXISTS

**Customer Center Pages**:

-   `resources/js/Pages/CustomerCenter/Index.tsx` ✅ CREATED (Landing page)
-   `resources/js/Pages/CustomerCenter/Faq.tsx` ✅ EXISTS
-   `resources/js/Pages/CustomerCenter/Notice.tsx` ✅ EXISTS
-   `resources/js/Pages/CustomerCenter/NoticeDetail.tsx` ✅ EXISTS
-   `resources/js/Pages/CustomerCenter/Inquiry.tsx` ✅ EXISTS
-   `resources/js/Pages/CustomerCenter/InquiryDetail.tsx` ✅ EXISTS
-   `resources/js/Pages/CustomerCenter/InquiryCreate.tsx` ✅ CREATED

### 📋 Route Structure

```
/mypage
├── / (dashboard)
├── /orders
├── /wishlist
├── /addresses
├── /payments
├── /notifications
├── /coupons
└── /settings (includes profile viewing)

/customer-center
├── / (main landing page) ✅ NEW
├── /faq
│   ├── /search
│   └── /{id}
├── /notices
│   ├── /search
│   └── /{id}
└── /inquiry (auth required)
    ├── / (list)
    ├── /create ✅ NEW
    └── /{id} (detail)
```

---

## Next Steps

### 1. Create Seeders (Optional)

You may want to create seeders for:

-   FAQs with common questions
-   Sample notices
-   Sample payment methods for testing

### 2. File Upload Implementation

Several features support file attachments:

-   Inquiry attachments
-   Notice attachments

You'll need to implement file upload functionality (S3/Cloudinary recommended)

### 3. Admin Panel

Create admin controllers and pages for:

-   Managing FAQs
-   Creating/editing notices
-   Answering inquiries
-   Viewing payment methods issues

### 4. Testing

Test all API endpoints with:

```bash
php artisan test
```

---

## Security Considerations

### ✅ Implemented

-   Ownership verification on all user data (addresses, coupons, wishlists, etc.)
-   Password verification for sensitive operations (2FA disable, account deletion)
-   Unique email validation
-   CSRF protection (Laravel default)
-   Sanctum token authentication for API routes
-   Soft deletes for payment methods (data retention)
-   Billing keys hidden from API responses

### 🔒 TODO

-   Implement actual 2FA verification flow (currently stubbed)
-   Add rate limiting to prevent abuse
-   Implement file upload validation and virus scanning
-   Add email verification for account changes
-   Implement account deletion grace period (30 days)
-   Add audit logging for sensitive operations

---

## API Response Format

All API endpoints return consistent JSON responses:

**Success**:

```json
{
  "message": "Success message in Korean",
  "data": { ... }
}
```

**Error**:

```json
{
    "message": "Error message in Korean",
    "errors": {
        "field": ["Validation error"]
    }
}
```

**HTTP Status Codes**:

-   200: Success
-   201: Created
-   422: Validation error
-   403: Unauthorized
-   404: Not found

---

## Notes

-   All Korean text is hardcoded in controllers. Consider moving to language files for i18n.
-   Payment method billing keys are stored encrypted (handled by Toss Payments SDK).
-   Marketing consent date tracking is required by Korean law (정보통신망법).
-   Do Not Disturb mode handles midnight-spanning periods correctly.
-   Account deletion is flagged, not hard deleted (for legal/compliance reasons).

---

**Generated**: 2025-11-28
**Status**: Design Complete - Ready for Frontend Integration
