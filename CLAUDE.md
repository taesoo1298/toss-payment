# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 12 application using **Inertia.js** with **React** and **TypeScript** for the frontend, built with Laravel Breeze authentication starter kit. The project appears to be for Toss payment integration based on the project name.

## Technology Stack

-   **Backend**: Laravel 12 (PHP 8.2+)
-   **Frontend**: React 18 + TypeScript
-   **Frontend Framework**: Inertia.js 2.0 (React adapter)
-   **Styling**: Tailwind CSS 3
-   **Build Tool**: Vite 7
-   **Database**: Mysql (configured in .env)
-   **Authentication**: Laravel Breeze with Sanctum
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

    -   `Welcome.tsx` - Landing page
    -   `Dashboard.tsx` - Authenticated dashboard
    -   `Auth/` - Authentication pages (Login, Register, ForgotPassword, etc.)
    -   `Profile/` - User profile management with partials

-   **Shared Components**: `resources/js/Components/`

    -   Reusable UI components (Buttons, Forms, Modals, etc.)
    -   Built with Headless UI and Tailwind CSS

-   **Layouts**: `resources/js/Layouts/`

    -   `AuthenticatedLayout.tsx` - For logged-in users
    -   `GuestLayout.tsx` - For public pages

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
-   **Toss SDK**: Loaded via CDN script in `app.blade.php` (v1/payment-widget)
