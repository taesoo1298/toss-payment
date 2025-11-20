# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dr.Smile E-Commerce Platform** - A premium dental care e-commerce platform specializing in toothpaste products made by dentists.

This is a Laravel 12 application using **Inertia.js** with **React** and **TypeScript** for the frontend, built with Laravel Breeze authentication starter kit. The platform features full e-commerce functionality including product catalog, shopping cart, checkout with Toss Payments integration, order management, and comprehensive MyPage features.

**See `SPECIFICATIONS.md` for complete technical specifications and feature documentation.**

## Technology Stack

-   **Backend**: Laravel 12 (PHP 8.2+)
-   **Frontend**: React 18 + TypeScript
-   **Frontend Framework**: Inertia.js 2.0 (React adapter)
-   **UI Components**: shadcn/ui (Radix UI based)
-   **Styling**: Tailwind CSS 3
-   **Build Tool**: Vite 7
-   **Database**: MySQL/MariaDB (configured in .env)
-   **Authentication**: Laravel Breeze with Sanctum
-   **Payment Gateway**: Toss Payments v2
-   **Queue/Cache/Session**: Database-backed

## Development Commands

### Initial Setup

```bash
composer install
npm install
php artisan migrate
```

Or use the composer script:

```bash
composer setup
```

### Development Server

Run all development servers concurrently (Laravel server, queue worker, and Vite):

```bash
composer dev
```

This starts:

-   PHP development server on default port (8000)
-   Queue worker (database connection)
-   Vite development server with HMR

Alternatively, run services individually:

```bash
php artisan serve          # Backend server
npm run dev                # Vite dev server
php artisan queue:listen   # Queue worker
```

### Building Assets

```bash
npm run build              # Production build with TypeScript compilation
npm run dev                # Development mode with HMR
```

### Testing

```bash
composer test              # Runs PHPUnit/Pest tests
php artisan test           # Direct artisan test command
```

### Code Quality

```bash
./vendor/bin/pint          # Laravel Pint (code formatting)
```

## Architecture

### Frontend Architecture

**Inertia.js Pattern**: The application uses Inertia.js to build SPAs with server-side routing. Controllers return Inertia responses instead of JSON APIs.

-   **Entry Point**: `resources/js/app.tsx`

    -   Configures Inertia app with page resolution from `resources/js/Pages/`
    -   Uses dynamic imports via Vite's `import.meta.glob`

-   **Page Components**: `resources/js/Pages/`

    -   `Welcome.tsx` - Dr.Smile landing page (e-commerce main)
    -   `Products/ProductList.tsx` - Product catalog with category filters
    -   `Products/ProductDetail.tsx` - Product detail with review system
    -   `Cart/Index.tsx` - Shopping cart
    -   `Payment/Checkout.tsx` - Checkout with address/coupon selection
    -   `Payment/Success.tsx` - Payment success handler
    -   `Payment/Fail.tsx` - Payment failure page
    -   `Payment/OrderComplete.tsx` - Order confirmation page
    -   `MyPage/Dashboard.tsx` - MyPage home with statistics
    -   `MyPage/OrderHistory.tsx` - Order management (cancel/refund/exchange)
    -   `MyPage/Coupons.tsx` - Coupon management
    -   `MyPage/Addresses.tsx` - Shipping address CRUD
    -   `MyPage/Wishlist.tsx` - Wishlist management
    -   `Auth/` - Authentication pages (Login, Register, ForgotPassword, etc.)
    -   `Profile/` - User profile management with partials

-   **Shared Components**: `resources/js/Components/`

    -   `Header.tsx` - Main navigation with cart and user menu
    -   `ProductCard.tsx` - Reusable product display card
    -   `ui/` - shadcn/ui components (Button, Card, Dialog, Badge, etc.)

-   **Layouts**: `resources/js/Layouts/`

    -   `AuthenticatedLayout.tsx` - Original Breeze layout
    -   `GuestLayout.tsx` - For public pages
    -   `MyPageLayout.tsx` - MyPage with sidebar navigation

-   **TypeScript Path Aliases**:
    -   `@/*` maps to `resources/js/*`
    -   `ziggy-js` for Laravel route helpers in frontend

### Backend Architecture

**Controllers** (`app/Http/Controllers/`):

-   Standard Laravel controller structure
-   `ProfileController` - User profile management
-   `Auth/` - Breeze authentication controllers (10 controllers for complete auth flow)

**Routes** (`routes/`):

-   `web.php` - Main application routes with Inertia responses
-   `auth.php` - Authentication routes (included in web.php)
-   `console.php` - Artisan commands

**Models** (`app/Models/`):

-   `User.php` - User model with Sanctum authentication

**Database** (`database/migrations/`):

-   Standard Laravel migrations for users, cache, and jobs tables
-   Queue and cache use database driver (as per .env)

### Key Integrations

**Ziggy**: Provides Laravel routes to JavaScript frontend

-   Configured in TypeScript paths
-   Allows type-safe route generation in React components

**Axios**: Pre-configured HTTP client

-   Global axios instance with CSRF headers
-   Configured in `resources/js/bootstrap.ts`

## Toss Payments Integration

**Payment Pages** (`resources/js/Pages/Payment/`):

-   `Create.tsx` - Payment creation form
-   `Success.tsx` - Payment success confirmation (auto-confirms with API)
-   `Fail.tsx` - Payment failure page

**Payment API** (`routes/api/payment_routes.php`):

-   `POST /api/payments/prepare` - Prepare payment before Toss redirect
-   `POST /api/payments/confirm` - Confirm payment after Toss callback
-   `GET /api/payments/{orderId}` - Get payment details
-   `POST /api/payments/{orderId}/cancel` - Cancel payment
-   `GET /api/payments` - List user's payments

**Controllers** (`app/Http/Controllers/Payment/`):

-   `TossPaymentController` - Handles payment operations
-   `TossWebhookController` - Handles webhook events from Toss

**Payment Flow**:

1. User fills form on `/payments/create`
2. Frontend calls `POST /api/payments/prepare` with Sanctum token
3. Backend creates order and returns order info
4. Frontend loads Toss Payments SDK (from CDN in `app.blade.php`)
5. Toss redirects to `/payments/success?paymentKey=xxx&orderId=xxx&amount=xxx`
6. Success page auto-calls `POST /api/payments/confirm` with Sanctum token
7. Backend confirms with Toss API and saves payment

**Environment Variables**:

-   `VITE_TOSS_CLIENT_KEY` - Toss client key for frontend SDK
-   `TOSS_SECRET_KEY` - Toss secret key for backend API
-   `TOSS_API_URL` - Toss API endpoint

## Authentication & Authorization

**Sanctum Token-Based Auth**: This project uses Laravel Sanctum with API tokens for API authentication.

**How It Works**:

1. On login, `AuthenticatedSessionController` creates API token and stores in session
2. `HandleInertiaRequests` middleware shares token with all Inertia pages via `auth.token` prop
3. `app.tsx` stores token in localStorage on page load
4. `bootstrap.ts` axios interceptor adds `Authorization: Bearer {token}` to all requests
5. API routes protected with `auth:sanctum` middleware

**Protected Routes**:

-   Web routes use session authentication (`auth` middleware)
-   API routes use token authentication (`auth:sanctum` middleware)
-   Payment pages require authentication

**Token Management**:

-   Tokens created on login: `$user->createToken('web-app')`
-   All user tokens deleted on logout: `$user->tokens()->delete()`
-   Token automatically included in axios requests via interceptor

See `SANCTUM_AUTH.md` for detailed authentication documentation.

## Configuration Notes

-   **Session/Cache/Queue**: All use database driver (check .env)
-   **Database**: MySQL/MariaDB on localhost (DB_DATABASE=toss_payment)
-   **Vite Config**: Single entry point at `resources/js/app.tsx`
-   **TypeScript**: Strict mode enabled with React JSX transform
-   **Toss SDK**: Loaded via CDN script in `app.blade.php` (v2/payment-widget)

## Current Implementation Status

### ✅ Implemented Features (Frontend Only - Mock Data)

**E-Commerce Core**:
- Product catalog with 8 categories (미백케어, 잇몸케어, 민감치아, etc.)
- Product listing with filters (price, features, rating) and sorting
- Product detail page with image gallery and specifications
- Shopping cart with quantity management
- Checkout flow with Toss Payments v2 integration
- Order completion and tracking

**User Features**:
- User authentication (Laravel Breeze + Sanctum)
- MyPage dashboard with order statistics
- Order history with status filtering
- Order management (cancel/refund/exchange)
- Coupon management (registration and usage)
- Shipping address CRUD with default address
- Wishlist functionality
- Product review system with rating and image upload

**Payment Integration**:
- Toss Payments v2 SDK integration
- Payment preparation and confirmation flow
- Multiple payment methods (card, transfer, easy pay)
- Payment success/failure handling
- Order completion tracking

### ⚠️ Backend Implementation Needed

**Database & Models**:
- [ ] Products table and Product model
- [ ] Orders table and Order model
- [ ] Order Items table
- [ ] Reviews table with image storage
- [ ] Coupons and User Coupons tables
- [ ] Addresses table
- [ ] Cart Items table
- [ ] Wishlist table

**API Endpoints**:
- [ ] Product CRUD APIs (`/api/products`)
- [ ] Cart management APIs (`/api/cart`)
- [ ] Order management APIs (`/api/orders`)
- [ ] Review APIs with image upload (`/api/reviews`)
- [ ] Coupon APIs (`/api/coupons`)
- [ ] Address APIs (`/api/addresses`)
- [ ] Wishlist APIs (`/api/wishlist`)

**Controllers**:
- [ ] ProductController
- [ ] CartController
- [ ] OrderController (cancel/refund/exchange)
- [ ] ReviewController
- [ ] CouponController
- [ ] AddressController
- [ ] WishlistController

**Additional Features**:
- [ ] Image upload to cloud storage (AWS S3/Cloudinary)
- [ ] Email notifications for orders
- [ ] Admin panel for product/order management
- [ ] Inventory management
- [ ] Points system implementation
- [ ] Order status webhooks and notifications

### 📝 Notes for Backend Implementation

**Priority Order**:
1. Database migrations for all tables (see SPECIFICATIONS.md section 4)
2. Product CRUD and seeding with real data
3. Cart and Order APIs to replace mock data
4. Payment confirmation should create real orders
5. Review and Coupon functionality
6. Admin panel for content management

**Current Data Flow**:
- All frontend pages currently use **mock data** (TypeScript interfaces)
- Payment APIs are functional but need integration with Order system
- User authentication is fully functional with Sanctum tokens
- Frontend is complete and ready for API integration

See `SPECIFICATIONS.md` for complete API specifications and database schema.
