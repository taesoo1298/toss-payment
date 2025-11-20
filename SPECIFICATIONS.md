# Dr.Smile E-Commerce Platform - Technical Specifications

## 1. Project Overview

### 1.1 Product Description
Dr.Smile is a premium dental care e-commerce platform specializing in toothpaste products made by dentists. The platform provides a comprehensive online shopping experience with integrated Toss Payments for secure transactions.

### 1.2 Technology Stack
- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 + TypeScript
- **Framework**: Inertia.js 2.0 (React adapter)
- **Styling**: Tailwind CSS 3 + shadcn/ui components
- **Build Tool**: Vite 7
- **Database**: MySQL/MariaDB
- **Authentication**: Laravel Sanctum (API tokens)
- **Payment Gateway**: Toss Payments v2
- **Queue/Cache/Session**: Database-backed

---

## 2. Functional Requirements

### 2.1 User Authentication & Authorization

#### 2.1.1 Authentication Flow
- **Registration**: Email-based registration with email verification
- **Login**: Session-based authentication for web routes
- **API Authentication**: Sanctum token-based authentication
- **Password Reset**: Email-based password recovery
- **Logout**: Token revocation and session destruction

#### 2.1.2 User Roles
- **Customer**: Standard user with shopping capabilities
- **Admin**: (Future) Platform management capabilities

### 2.2 Product Management

#### 2.2.1 Product Catalog
- **Categories** (8 main categories):
  - 전체상품 (All Products)
  - 미백케어 (Whitening Care)
  - 잇몸케어 (Gum Care)
  - 민감치아 (Sensitive Teeth)
  - 어린이용 (Kids)
  - 한방치약 (Herbal)
  - 토탈케어 (Total Care)
  - 선물세트 (Gift Sets)

#### 2.2.2 Product Features
- Product listing with pagination
- Category-based filtering
- Multi-criteria filtering:
  - Price range (₩0 - ₩50,000+)
  - Features (미백, 잇몸케어, 민감치아, etc.)
  - Rating (1-5 stars)
- Sorting options:
  - Popular (인기순)
  - Recent (최신순)
  - Price Low to High (낮은 가격순)
  - Price High to Low (높은 가격순)
  - Rating (평점순)

#### 2.2.3 Product Detail
- High-resolution product images with gallery
- Product information tabs:
  - Overview (제품설명)
  - Ingredients (성분정보)
  - Usage (사용방법)
  - Reviews (리뷰)
- Quantity selector
- Add to cart functionality
- Wishlist toggle
- Share functionality
- Related products section

### 2.3 Shopping Cart

#### 2.3.1 Cart Features
- Add/remove items
- Quantity adjustment
- Real-time price calculation
- Coupon application
- Cart persistence (session-based)

#### 2.3.2 Cart Information Display
- Product thumbnails and names
- Individual item prices
- Quantity controls
- Subtotal per item
- Total amount calculation
- Applied discounts

### 2.4 Checkout & Payment

#### 2.4.1 Checkout Process
1. Cart review
2. Shipping information input
3. Payment method selection
4. Coupon application
5. Order confirmation
6. Payment processing (Toss Payments)
7. Order completion

#### 2.4.2 Shipping Information
- Recipient name
- Phone number
- Address (with postal code search)
- Delivery memo options:
  - 문 앞에 놓아주세요
  - 배송 전 연락주세요
  - 경비실에 맡겨주세요
  - 택배함에 넣어주세요
  - 직접 입력

#### 2.4.3 Payment Methods (via Toss Payments)
- Credit/Debit Cards
- Bank Transfer
- Easy Payment (간편결제):
  - Kakao Pay
  - Naver Pay
  - Toss Pay
- Mobile Carrier Billing

#### 2.4.4 Payment Flow
```
1. Prepare Payment (POST /api/payments/prepare)
   - Create order record
   - Generate orderId
   - Calculate final amount

2. Initialize Toss Payment Widget
   - Load SDK from CDN
   - Configure payment methods
   - Display payment UI

3. User Completes Payment
   - Toss handles payment processing
   - Redirect to success page with paymentKey

4. Confirm Payment (POST /api/payments/confirm)
   - Verify payment with Toss API
   - Update order status
   - Create payment transaction record

5. Display Order Complete Page
   - Show order summary
   - Provide order tracking link
```

### 2.5 Order Management

#### 2.5.1 Order Status Flow
```
주문완료 (Order Placed)
  ↓
상품준비중 (Preparing)
  ↓
배송중 (Shipping)
  ↓
배송완료 (Delivered)
```

#### 2.5.2 Order Actions
- **결제취소 (Cancel)**: Available when status = "주문완료" or "상품준비중"
- **반품 (Refund)**: Available when status = "배송완료"
- **교환 (Exchange)**: Available when status = "배송완료"

#### 2.5.3 Order Information
- Order ID (unique identifier)
- Order date and time
- Order status
- Ordered items with quantities
- Shipping information
- Payment information
- Total amount breakdown

### 2.6 My Page Features

#### 2.6.1 Dashboard
- Welcome message with user name
- Order status summary (preparing, shipping, delivered)
- Wishlist count
- Available points
- Available coupons count
- Recent orders (last 3)
- Quick action buttons

#### 2.6.2 Order History
- Complete order listing
- Status-based filtering tabs
- Order detail view
- Cancel/Refund/Exchange actions
- Order tracking link

#### 2.6.3 Coupon Management
- **Coupon Registration**: By coupon code
- **Coupon Types**:
  - Percentage discount
  - Fixed amount discount
- **Coupon Conditions**:
  - Minimum purchase amount
  - Maximum discount amount
  - Expiration date
  - Applicable categories
- **Coupon Status Tabs**:
  - Available (사용가능)
  - Used (사용완료)
  - Expired (기간만료)

#### 2.6.4 Address Management
- CRUD operations for shipping addresses
- Address types: Home (집), Office (회사), Other (기타)
- Default address setting
- Maximum 10 addresses per user
- Address fields:
  - Address name (배송지명)
  - Recipient name (받는 사람)
  - Phone number (연락처)
  - Postal code (우편번호)
  - Base address (기본주소)
  - Detailed address (상세주소)

#### 2.6.5 Wishlist
- Add/remove products
- Grid view with product cards
- Quick add to cart
- Product availability status

### 2.7 Review System

#### 2.7.1 Review Features
- **Rating**: 1-5 stars
- **Review Content**: Text-based review (minimum 10 characters)
- **Image Upload**: Up to 5 images per review
- **Verification Badge**: "구매확인" badge for verified purchases

#### 2.7.2 Review Display
- Average rating calculation
- Total review count
- Individual reviews with:
  - User name (masked: 김*연)
  - Rating stars
  - Date
  - Review content
  - Uploaded images (clickable thumbnails)
  - Verification badge

#### 2.7.3 Review Guidelines
- Product-related content only
- No advertising or spam
- No personal information
- No defamatory content
- Point rewards for verified purchase reviews

---

## 3. API Specifications

### 3.1 Authentication APIs

```http
POST /login
Request:
  - email: string
  - password: string
  - remember: boolean
Response:
  - user: User object
  - token: string (Sanctum token)

POST /register
Request:
  - name: string
  - email: string
  - password: string
  - password_confirmation: string
Response:
  - user: User object

POST /logout
Headers:
  - Authorization: Bearer {token}
Response:
  - success: boolean
```

### 3.2 Payment APIs

```http
POST /api/payments/prepare
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "orderId": "ORDER-20251104-001234",
    "amount": 54700,
    "orderName": "Dr.Smile 프리미엄 미백 치약 외 1건",
    "customerName": "홍길동",
    "customerEmail": "user@example.com",
    "customerMobilePhone": "010-1234-5678"
  }
Response:
  {
    "orderId": "ORDER-20251104-001234",
    "amount": 54700,
    "orderName": "Dr.Smile 프리미엄 미백 치약 외 1건"
  }

POST /api/payments/confirm
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "paymentKey": "payment_key_from_toss",
    "orderId": "ORDER-20251104-001234",
    "amount": 54700
  }
Response:
  {
    "orderId": "ORDER-20251104-001234",
    "status": "completed",
    "payment": Payment object
  }

GET /api/payments/{orderId}
Headers:
  - Authorization: Bearer {token}
Response:
  {
    "payment": Payment object
  }

POST /api/payments/{orderId}/cancel
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "cancelReason": "고객 변심"
  }
Response:
  {
    "success": boolean,
    "message": string
  }

GET /api/payments
Headers:
  - Authorization: Bearer {token}
Query Params:
  - page: number
  - per_page: number
  - status: string
Response:
  {
    "payments": Payment[],
    "pagination": PaginationMeta
  }
```

### 3.3 Product APIs (To Be Implemented)

```http
GET /api/products
Query Params:
  - category: string
  - price_min: number
  - price_max: number
  - features: string[]
  - rating: number
  - sort: string (popular|recent|price_asc|price_desc|rating)
  - page: number
  - per_page: number
Response:
  {
    "products": Product[],
    "pagination": PaginationMeta
  }

GET /api/products/{id}
Response:
  {
    "product": Product,
    "relatedProducts": Product[]
  }
```

### 3.4 Cart APIs (To Be Implemented)

```http
GET /api/cart
Headers:
  - Authorization: Bearer {token}
Response:
  {
    "items": CartItem[],
    "total": number
  }

POST /api/cart/items
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "productId": number,
    "quantity": number
  }

PUT /api/cart/items/{id}
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "quantity": number
  }

DELETE /api/cart/items/{id}
Headers:
  - Authorization: Bearer {token}
```

### 3.5 Order APIs (To Be Implemented)

```http
GET /api/orders
Headers:
  - Authorization: Bearer {token}
Query Params:
  - status: string
  - page: number
Response:
  {
    "orders": Order[],
    "pagination": PaginationMeta
  }

GET /api/orders/{orderId}
Headers:
  - Authorization: Bearer {token}
Response:
  {
    "order": Order
  }

POST /api/orders/{orderId}/cancel
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "reason": string
  }

POST /api/orders/{orderId}/refund
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "itemIds": number[],
    "reason": string
  }

POST /api/orders/{orderId}/exchange
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "itemIds": number[],
    "reason": string
  }
```

### 3.6 Review APIs (To Be Implemented)

```http
GET /api/products/{id}/reviews
Query Params:
  - page: number
  - per_page: number
Response:
  {
    "reviews": Review[],
    "averageRating": number,
    "totalCount": number,
    "pagination": PaginationMeta
  }

POST /api/products/{id}/reviews
Headers:
  - Authorization: Bearer {token}
Request (multipart/form-data):
  - rating: number (1-5)
  - content: string
  - images[]: file[] (max 5)
Response:
  {
    "review": Review
  }

PUT /api/reviews/{id}
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "rating": number,
    "content": string
  }

DELETE /api/reviews/{id}
Headers:
  - Authorization: Bearer {token}
```

### 3.7 Coupon APIs (To Be Implemented)

```http
GET /api/coupons
Headers:
  - Authorization: Bearer {token}
Query Params:
  - status: string (available|used|expired)
Response:
  {
    "coupons": Coupon[]
  }

POST /api/coupons/register
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "code": string
  }
Response:
  {
    "coupon": Coupon
  }
```

### 3.8 Address APIs (To Be Implemented)

```http
GET /api/addresses
Headers:
  - Authorization: Bearer {token}
Response:
  {
    "addresses": Address[]
  }

POST /api/addresses
Headers:
  - Authorization: Bearer {token}
Request:
  {
    "name": string,
    "recipient": string,
    "phone": string,
    "postalCode": string,
    "address": string,
    "addressDetail": string,
    "type": string (home|office|etc),
    "isDefault": boolean
  }

PUT /api/addresses/{id}
Headers:
  - Authorization: Bearer {token}
Request: Same as POST

DELETE /api/addresses/{id}
Headers:
  - Authorization: Bearer {token}

POST /api/addresses/{id}/set-default
Headers:
  - Authorization: Bearer {token}
```

---

## 4. Database Schema

### 4.1 Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### 4.2 Products Table (To Be Created)
```sql
CREATE TABLE products (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2) NULL,
    category VARCHAR(100) NOT NULL,
    features JSON NULL, -- ["미백", "잇몸케어", etc.]
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INT DEFAULT 0,
    stock INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    images JSON NULL, -- Array of image URLs
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    INDEX idx_category (category),
    INDEX idx_rating (rating),
    INDEX idx_price (price)
);
```

### 4.3 Orders Table (To Be Created)
```sql
CREATE TABLE orders (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'preparing', 'shipping', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',

    -- Customer Info
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,

    -- Shipping Info
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    address_detail VARCHAR(255),
    delivery_memo TEXT,

    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    coupon_discount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Coupon
    coupon_id BIGINT UNSIGNED NULL,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);
```

### 4.4 Order Items Table (To Be Created)
```sql
CREATE TABLE order_items (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order_id (order_id)
);
```

### 4.5 Payments Table (Existing)
```sql
CREATE TABLE payments (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    payment_key VARCHAR(255) UNIQUE NOT NULL,
    method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled', 'failed') DEFAULT 'pending',
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_payment_key (payment_key)
);
```

### 4.6 Payment Transactions Table (Existing)
```sql
CREATE TABLE payment_transactions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT UNSIGNED NOT NULL,
    transaction_key VARCHAR(255) NOT NULL,
    type ENUM('payment', 'cancel', 'refund') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    response_data JSON,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    INDEX idx_payment_id (payment_id)
);
```

### 4.7 Reviews Table (To Be Created)
```sql
CREATE TABLE reviews (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NULL, -- For verified purchase
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    images JSON NULL, -- Array of image URLs
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating)
);
```

### 4.8 Coupons Table (To Be Created)
```sql
CREATE TABLE coupons (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2) NULL,
    applicable_categories JSON NULL,
    usage_limit INT NULL, -- Total usage limit
    usage_count INT DEFAULT 0,
    valid_from TIMESTAMP NULL,
    valid_until TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    INDEX idx_code (code),
    INDEX idx_valid_until (valid_until)
);
```

### 4.9 User Coupons Table (To Be Created)
```sql
CREATE TABLE user_coupons (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    coupon_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL, -- NULL if not used
    status ENUM('available', 'used', 'expired') DEFAULT 'available',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    UNIQUE KEY unique_user_coupon (user_id, coupon_id)
);
```

### 4.10 Addresses Table (To Be Created)
```sql
CREATE TABLE addresses (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL, -- "우리집", "회사", etc.
    recipient VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    address_detail VARCHAR(255),
    type ENUM('home', 'office', 'etc') DEFAULT 'home',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_default (user_id, is_default)
);
```

### 4.11 Cart Table (To Be Created)
```sql
CREATE TABLE cart_items (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id)
);
```

### 4.12 Wishlist Table (To Be Created)
```sql
CREATE TABLE wishlists (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id)
);
```

---

## 5. Frontend Component Structure

### 5.1 Page Components (`resources/js/Pages/`)

```
Pages/
├── Welcome.tsx                 # Landing page (Dr.Smile main)
├── Dashboard.tsx              # User dashboard (unused - replaced by MyPage)
├── Auth/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   ├── ResetPassword.tsx
│   └── VerifyEmail.tsx
├── Products/
│   ├── ProductList.tsx        # Product listing with filters
│   └── ProductDetail.tsx      # Product detail with reviews
├── Cart/
│   └── Index.tsx              # Shopping cart
├── Payment/
│   ├── Checkout.tsx           # Checkout process
│   ├── Success.tsx            # Payment success (redirects to OrderComplete)
│   ├── Fail.tsx               # Payment failure
│   └── OrderComplete.tsx      # Order completion page
└── MyPage/
    ├── Dashboard.tsx          # MyPage home
    ├── OrderHistory.tsx       # Order management
    ├── Coupons.tsx           # Coupon management
    ├── Addresses.tsx         # Address management
    ├── Wishlist.tsx          # Wishlist
    ├── Payments.tsx          # Payment methods (future)
    ├── Notifications.tsx     # Notifications (future)
    └── Settings.tsx          # User settings (future)
```

### 5.2 Layout Components (`resources/js/Layouts/`)

```
Layouts/
├── AuthenticatedLayout.tsx    # Original Breeze layout
├── GuestLayout.tsx           # Guest pages layout
└── MyPageLayout.tsx          # MyPage sidebar layout
```

### 5.3 Shared Components (`resources/js/Components/`)

```
Components/
├── Header.tsx                # Main navigation header
├── ProductCard.tsx           # Product card component
├── ApplicationLogo.tsx       # Logo component
└── ui/                       # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── label.tsx
    ├── tabs.tsx
    ├── checkbox.tsx
    └── ... (other shadcn components)
```

---

## 6. Routing Structure

### 6.1 Web Routes (`routes/web.php`)

```php
// Public Routes
GET  /                          # Landing page (Welcome.tsx)
GET  /products                  # Product list (ProductList.tsx)
GET  /category/{category}       # Category filtered products
GET  /product/{id}              # Product detail (ProductDetail.tsx)

// Auth Routes (from auth.php)
GET  /login                     # Login page
POST /login                     # Login action
GET  /register                  # Register page
POST /register                  # Register action
POST /logout                    # Logout action
GET  /forgot-password           # Forgot password page
POST /forgot-password           # Password reset link
GET  /reset-password/{token}    # Reset password page
POST /reset-password            # Reset password action

// Protected Routes (auth middleware)
GET  /dashboard                 # User dashboard (unused)
GET  /profile                   # User profile

// Cart Routes
GET  /cart                      # Shopping cart

// Checkout & Payment Routes
GET  /checkout                  # Checkout page (Checkout.tsx)
GET  /payments/success          # Payment success (Success.tsx)
GET  /payments/fail             # Payment failure (Fail.tsx)
GET  /order/complete            # Order complete (OrderComplete.tsx)

// MyPage Routes
GET  /mypage                    # MyPage dashboard
GET  /mypage/orders             # Order history
GET  /mypage/coupons            # Coupon management
GET  /mypage/addresses          # Address management
GET  /mypage/wishlist           # Wishlist
GET  /mypage/payments           # Payment methods (future)
GET  /mypage/notifications      # Notifications (future)
GET  /mypage/settings           # Settings (future)
```

### 6.2 API Routes (`routes/api.php`)

```php
// Payment API (auth:sanctum middleware)
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('payments')->group(function () {
        Route::post('/prepare', [TossPaymentController::class, 'prepare']);
        Route::post('/confirm', [TossPaymentController::class, 'confirm']);
        Route::get('/{orderId}', [TossPaymentController::class, 'show']);
        Route::post('/{orderId}/cancel', [TossPaymentController::class, 'cancel']);
        Route::get('/', [TossPaymentController::class, 'index']);
    });

    // Future API Routes
    // Route::apiResource('products', ProductController::class);
    // Route::apiResource('cart', CartController::class);
    // Route::apiResource('orders', OrderController::class);
    // Route::apiResource('reviews', ReviewController::class);
    // Route::apiResource('coupons', CouponController::class);
    // Route::apiResource('addresses', AddressController::class);
});

// Webhook Routes (no auth - verified by signature)
Route::post('/webhooks/toss', [TossWebhookController::class, 'handle']);
```

---

## 7. Environment Variables

### 7.1 Application
```env
APP_NAME=Dr.Smile
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost
```

### 7.2 Database
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=toss_payment
DB_USERNAME=root
DB_PASSWORD=
```

### 7.3 Toss Payments
```env
# Frontend (accessible via import.meta.env.VITE_*)
VITE_TOSS_CLIENT_KEY=test_ck_xxxxxxxxxxxxxxxxxxxxx

# Backend
TOSS_SECRET_KEY=test_sk_xxxxxxxxxxxxxxxxxxxxx
TOSS_API_URL=https://api.tosspayments.com/v1
```

### 7.4 Session/Cache/Queue
```env
SESSION_DRIVER=database
CACHE_DRIVER=database
QUEUE_CONNECTION=database
```

---

## 8. Development Workflow

### 8.1 Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd toss-payment

# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate

# Start development servers
composer dev
```

### 8.2 Development Commands
```bash
# Run all services (recommended)
composer dev

# Or run individually
php artisan serve          # Laravel server (port 8000)
npm run dev                # Vite dev server with HMR
php artisan queue:listen   # Queue worker

# Build for production
npm run build

# Run tests
composer test
php artisan test

# Code formatting
./vendor/bin/pint
```

---

## 9. Security Considerations

### 9.1 Authentication Security
- CSRF protection enabled for all form submissions
- Sanctum tokens for API authentication
- Password hashing with bcrypt
- Email verification for new registrations
- Rate limiting on login attempts

### 9.2 Payment Security
- Toss Payments webhook signature verification
- Amount validation on payment confirmation
- HTTPS required for production
- PCI DSS compliance through Toss Payments

### 9.3 Data Protection
- Input validation and sanitization
- XSS protection via React's default escaping
- SQL injection protection via Eloquent ORM
- CORS configuration for API endpoints

---

## 10. Future Enhancements

### 10.1 Backend Implementation Needed
- [ ] Product CRUD APIs and admin panel
- [ ] Cart persistence in database
- [ ] Order management APIs
- [ ] Review APIs with image upload to cloud storage
- [ ] Coupon management APIs
- [ ] Address management APIs
- [ ] Wishlist APIs
- [ ] Points system implementation
- [ ] Email notifications for orders

### 10.2 Frontend Enhancements
- [ ] Product search functionality
- [ ] Advanced filtering (brand, volume, etc.)
- [ ] Product comparison feature
- [ ] Order tracking page
- [ ] Review image lightbox/gallery
- [ ] Social sharing integration
- [ ] Live chat support
- [ ] Mobile app (React Native)

### 10.3 Business Features
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Sales analytics and reporting
- [ ] Customer segmentation
- [ ] Email marketing integration
- [ ] Loyalty program
- [ ] Subscription/recurring orders
- [ ] Gift card functionality

### 10.4 Performance Optimization
- [ ] Product image CDN integration
- [ ] Database query optimization
- [ ] Caching strategy (Redis)
- [ ] Lazy loading for product images
- [ ] API response pagination
- [ ] Server-side rendering consideration

---

## 11. Testing Strategy

### 11.1 Backend Testing
- Unit tests for business logic
- Feature tests for API endpoints
- Payment integration tests (sandbox mode)
- Database migration tests

### 11.2 Frontend Testing
- Component unit tests (Vitest/Jest)
- E2E tests (Playwright/Cypress)
- Accessibility testing
- Cross-browser compatibility

### 11.3 Test Coverage Goals
- Backend: 80%+ code coverage
- Frontend: 70%+ component coverage
- Critical paths: 100% coverage (checkout, payment)

---

## Appendix

### A. TypeScript Interfaces

#### Product Interface
```typescript
interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    features: string[];
    rating?: number;
    reviewCount?: number;
    stock: number;
    imageUrl: string;
    images?: string[];
}
```

#### Order Interface
```typescript
interface Order {
    id: string;
    orderId: string;
    userId: number;
    status: 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';
    items: OrderItem[];
    shippingInfo: ShippingInfo;
    paymentInfo: PaymentInfo;
    subtotal: number;
    shippingCost: number;
    couponDiscount: number;
    totalAmount: number;
    createdAt: string;
}
```

#### Review Interface
```typescript
interface Review {
    id: number;
    userName: string;
    rating: number;
    date: string;
    content: string;
    images?: string[];
    verified: boolean;
}
```

#### Coupon Interface
```typescript
interface Coupon {
    id: number;
    code: string;
    name: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchaseAmount: number;
    maxDiscountAmount?: number;
    validFrom: string;
    validUntil: string;
    status: 'available' | 'used' | 'expired';
}
```

#### Address Interface
```typescript
interface Address {
    id: string;
    name: string;
    recipient: string;
    phone: string;
    postalCode: string;
    address: string;
    addressDetail: string;
    type: 'home' | 'office' | 'etc';
    isDefault: boolean;
}
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-04
**Status**: Living Document (To be updated as features are implemented)
