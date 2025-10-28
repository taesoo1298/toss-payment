# Toss Payments Laravel Integration

Laravel 최신 아키텍처와 best practice를 적용한 Toss Payments 결제 모듈입니다.

## 📚 목차

-   [특징](#특징)
-   [요구사항](#요구사항)
-   [설치](#설치)
-   [설정](#설정)
-   [사용법](#사용법)
-   [API 엔드포인트](#api-엔드포인트)
-   [이벤트 시스템](#이벤트-시스템)
-   [테스트](#테스트)
-   [보안](#보안)
-   [트러블슈팅](#트러블슈팅)

## ✨ 특징

-   **최신 Laravel 아키텍처**: Laravel 11/12의 최신 기능 활용
-   **서비스 레이어 패턴**: 비즈니스 로직을 서비스로 분리
-   **리포지토리 패턴**: 데이터 접근 로직 추상화
-   **이벤트 기반 아키텍처**: 결제 완료, 취소 등의 이벤트 처리
-   **Form Request 검증**: 요청 데이터 검증 로직 분리
-   **API Resource**: 일관된 API 응답 형식
-   **Queue 지원**: 웹훅 처리를 비동기로 수행
-   **포괄적인 테스트**: Feature Test 포함
-   **PSR 준수**: Laravel 커뮤니티 표준 준수

## 📋 요구사항

-   PHP 8.2 이상
-   Laravel 11.x 이상
-   MySQL 8.0 이상 또는 PostgreSQL 14 이상
-   Redis (Queue 사용 시)
-   Composer

## 🚀 설치

### 1. 패키지 설치

```bash
composer require laravel/sanctum
composer require guzzlehttp/guzzle
```

### 2. 파일 복사

다음 파일들을 프로젝트에 복사합니다:

```
app/
├── Enums/Payment/
├── Models/
├── Http/
│   ├── Controllers/Payment/
│   ├── Requests/Payment/
│   ├── Resources/Payment/
│   └── Middleware/
├── Services/Payment/
├── Repositories/Payment/
├── Events/Payment/
├── Listeners/Payment/
├── Jobs/Payment/
└── Exceptions/Payment/

config/toss.php
routes/payment_routes.php
database/migrations/
```

### 3. Migration 실행

```bash
php artisan migrate
```

### 4. Route 등록

`routes/api.php`에 다음 추가:

```php
require __DIR__.'/payment_routes.php';
```

### 5. Service Provider 등록

`bootstrap/providers.php` (Laravel 11) 또는 `config/app.php` (Laravel 10 이하)에 EventServiceProvider 등록

## ⚙️ 설정

### 1. 환경 변수 설정 (.env)

```env
# Toss Payments Configuration
TOSS_CLIENT_KEY=test_ck_xxxxxxxxxx
TOSS_SECRET_KEY=test_sk_xxxxxxxxxx
TOSS_API_URL=https://api.tosspayments.com
TOSS_SUCCESS_URL="${APP_URL}/payments/success"
TOSS_FAIL_URL="${APP_URL}/payments/fail"
TOSS_WEBHOOK_SECRET=your_webhook_secret_key

# Queue Configuration (권장)
QUEUE_CONNECTION=redis
```

### 2. Toss Payments 개발자 센터 설정

1. [Toss Payments 개발자 센터](https://developers.tosspayments.com/) 접속
2. API 키 발급 (테스트용 / 실제용)
3. 웹훅 URL 등록: `https://yourdomain.com/api/payments/webhook/toss`

### 3. Queue Worker 실행

```bash
php artisan queue:work
```

## 📖 사용법

### 1. 결제 준비

프론트엔드에서 결제 준비 API 호출:

```javascript
// 결제 준비
const response = await fetch("/api/payments/prepare", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
        order_name: "테스트 상품",
        amount: 10000,
        method: "card",
        customer_name: "홍길동",
        customer_email: "test@example.com",
        customer_mobile_phone: "01012345678",
    }),
});

const { data } = await response.json();
```

### 2. Toss Payments 결제창 호출

```javascript
// Toss Payments SDK 초기화
import { loadTossPayments } from "@tosspayments/payment-sdk";

const tossPayments = await loadTossPayments("CLIENT_KEY");

// 결제창 호출
await tossPayments.requestPayment("카드", {
    amount: data.amount,
    orderId: data.order_id,
    orderName: data.order_name,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    successUrl: "https://yourdomain.com/payments/success",
    failUrl: "https://yourdomain.com/payments/fail",
});
```

### 3. 결제 승인 (Success 페이지에서)

```javascript
// URL에서 파라미터 추출
const urlParams = new URLSearchParams(window.location.search);
const paymentKey = urlParams.get("paymentKey");
const orderId = urlParams.get("orderId");
const amount = urlParams.get("amount");

// 결제 승인 요청
const response = await fetch("/api/payments/confirm", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
        payment_key: paymentKey,
        order_id: orderId,
        amount: parseInt(amount),
    }),
});

const result = await response.json();
if (result.success) {
    // 결제 완료 처리
    console.log("결제 완료:", result.data);
}
```

### 4. 결제 취소

```javascript
const response = await fetch(`/api/payments/${orderId}/cancel`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
        cancel_reason: "단순 변심",
        cancel_amount: 10000, // 부분 취소 시 금액 지정, 전체 취소 시 생략
    }),
});
```

## 🔌 API 엔드포인트

### 결제 관리

| Method | URI                              | Description          | Auth |
| ------ | -------------------------------- | -------------------- | ---- |
| POST   | `/api/payments/prepare`          | 결제 준비            | ✅   |
| POST   | `/api/payments/confirm`          | 결제 승인            | ✅   |
| GET    | `/api/payments`                  | 결제 목록 조회       | ✅   |
| GET    | `/api/payments/{orderId}`        | 결제 상세 조회       | ✅   |
| POST   | `/api/payments/{orderId}/cancel` | 결제 취소            | ✅   |
| GET    | `/api/payments/success`          | 결제 성공 리다이렉트 | -    |
| GET    | `/api/payments/fail`             | 결제 실패 리다이렉트 | -    |
| POST   | `/api/payments/webhook/toss`     | Toss 웹훅            | -    |

### 요청/응답 예시

#### 결제 준비

**Request:**

```json
{
    "order_name": "테스트 상품",
    "amount": 10000,
    "method": "card",
    "customer_name": "홍길동",
    "customer_email": "test@example.com",
    "customer_mobile_phone": "01012345678",
    "tax_free_amount": 0,
    "metadata": {
        "custom_field": "custom_value"
    }
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "order_id": "ORDER_20250101123456_ABCD1234",
        "order_name": "테스트 상품",
        "amount": 10000,
        "customer_name": "홍길동",
        "customer_email": "test@example.com",
        "success_url": "https://yourdomain.com/payments/success",
        "fail_url": "https://yourdomain.com/payments/fail"
    }
}
```

## 🎯 이벤트 시스템

### 사용 가능한 이벤트

1. **PaymentCompleted**: 결제 완료 시
2. **PaymentFailed**: 결제 실패 시
3. **PaymentCancelled**: 결제 취소 시

### 커스텀 리스너 추가

```php
// app/Listeners/Payment/SendSlackNotification.php
class SendSlackNotification implements ShouldQueue
{
    public function handle(PaymentCompleted $event): void
    {
        // Slack 알림 전송
        Notification::route('slack', config('slack.webhook_url'))
            ->notify(new PaymentCompletedNotification($event->payment));
    }
}

// app/Providers/EventServiceProvider.php
protected $listen = [
    PaymentCompleted::class => [
        SendPaymentConfirmationEmail::class,
        UpdateOrderStatus::class,
        SendSlackNotification::class, // 추가
    ],
];
```

## 🧪 테스트

### Feature Test 실행

```bash
php artisan test --filter=TossPaymentTest
```

### 테스트 케이스

-   ✅ 결제 준비
-   ✅ 결제 승인
-   ✅ 금액 불일치 검증
-   ✅ 결제 취소
-   ✅ 결제 상세 조회
-   ✅ 인증 검증
-   ✅ 입력 검증

### Mock 테스트

```php
Http::fake([
    '*/v1/payments/confirm' => Http::response([
        'paymentKey' => 'test_key',
        'status' => 'DONE',
        // ...
    ], 200),
]);
```

## 🔒 보안

### 1. 웹훅 서명 검증

`config/toss.php`에서 설정:

```php
'webhook' => [
    'enabled' => true,
    'verify_signature' => true, // 프로덕션에서 필수
],
```

### 2. API 키 보안

-   `.env` 파일에 API 키 저장
-   버전 관리 시스템에 `.env` 포함하지 않기
-   프로덕션과 개발 환경의 키 분리

### 3. HTTPS 사용

프로덕션 환경에서는 반드시 HTTPS 사용:

```env
APP_URL=https://yourdomain.com
```

### 4. Rate Limiting

`app/Http/Kernel.php`에 rate limiter 추가:

```php
RateLimiter::for('payments', function (Request $request) {
    return Limit::perMinute(10)->by($request->user()?->id);
});
```

## 🐛 트러블슈팅

### 1. 결제 승인 실패

**증상:** "결제 금액이 일치하지 않습니다" 오류

**해결방법:**

-   결제 준비 시 저장된 금액과 승인 요청 금액 확인
-   부가세 계산 로직 검증

### 2. 웹훅 미수신

**증상:** 웹훅이 도착하지 않음

**해결방법:**

-   Toss 개발자 센터에서 웹훅 URL 확인
-   서버 방화벽 설정 확인
-   HTTPS 사용 확인
-   로그 확인: `storage/logs/laravel.log`

### 3. Queue Job 실행 안됨

**증상:** 웹훅 처리가 지연됨

**해결방법:**

```bash
# Queue worker 확인
php artisan queue:work

# Failed jobs 확인
php artisan queue:failed

# 재시도
php artisan queue:retry all
```

### 4. 데이터베이스 연결 오류

**해결방법:**

```bash
# Migration 상태 확인
php artisan migrate:status

# Migration 재실행
php artisan migrate:fresh
```

## 📊 모니터링

### 로그 확인

```php
// 결제 관련 로그 필터링
tail -f storage/logs/laravel.log | grep "Payment"
```

### 통계 조회

```php
use App\Repositories\Payment\PaymentRepository;

$repository = app(PaymentRepository::class);
$stats = $repository->getStatistics([
    'from_date' => now()->subDays(30),
    'to_date' => now(),
]);
```

## 🔄 업그레이드

### Laravel 11 → 12

1. 의존성 업데이트

```bash
composer update
```

2. Breaking changes 확인

```bash
php artisan about
```

## 📝 Best Practices

1. **Fat Models, Skinny Controllers**: 비즈니스 로직은 Service에
2. **Form Request**: 검증 로직 분리
3. **API Resources**: 일관된 응답 형식
4. **Event/Listener**: 결제 후 처리를 이벤트로
5. **Queue**: 웹훅 처리는 비동기로
6. **Testing**: 모든 주요 기능에 테스트 작성
7. **Logging**: 중요한 작업은 로그 남기기

## 📚 참고 자료

-   [Toss Payments 공식 문서](https://docs.tosspayments.com/)
-   [Laravel 공식 문서](https://laravel.com/docs)
-   [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)

## 📄 라이센스

MIT License

## 🤝 기여

Issue와 Pull Request를 환영합니다!
