# 📦 Toss Payments Laravel 모듈 - 파일 목록

## 📁 전체 파일 구조

총 **31개 파일**이 생성되었습니다.

### 📚 문서 파일

| 파일명              | 설명                | 크기  |
| ------------------- | ------------------- | ----- |
| **README.md**       | 종합 사용 설명서    | 11KB  |
| **INSTALLATION.md** | 상세 설치 가이드    | 8.3KB |
| **ARCHITECTURE.md** | 아키텍처 설계 문서  | 22KB  |
| **FILE_INDEX.md**   | 이 파일 (파일 목록) | -     |

### 🎯 핵심 Laravel 파일

#### 1. Enums (2개)

```
app/Enums/Payment/
├── PaymentStatus.php (1.5KB) - 결제 상태 enum
└── PaymentMethod.php (1.5KB) - 결제 수단 enum
```

#### 2. Models (2개)

```
app/Models/
├── Payment.php (3.5KB) - 결제 정보 모델
└── PaymentTransaction.php (1.3KB) - 결제 트랜잭션 모델
```

#### 3. Controllers (2개)

```
app/Http/Controllers/Payment/
├── TossPaymentController.php (6.3KB) - 결제 API 컨트롤러
└── TossWebhookController.php (1.6KB) - 웹훅 처리 컨트롤러
```

#### 4. Form Requests (3개)

```
app/Http/Requests/Payment/
├── PaymentPrepareRequest.php (2.4KB) - 결제 준비 검증
├── PaymentConfirmRequest.php (1.1KB) - 결제 승인 검증
└── PaymentCancelRequest.php (1.2KB) - 결제 취소 검증
```

#### 5. API Resources (2개)

```
app/Http/Resources/Payment/
├── PaymentResource.php (3.1KB) - 결제 정보 리소스
└── PaymentTransactionResource.php (718B) - 트랜잭션 리소스
```

#### 6. Middleware (1개)

```
app/Http/Middleware/
└── VerifyTossWebhookSignature.php (1.2KB) - 웹훅 서명 검증
```

#### 7. Services (2개)

```
app/Services/Payment/
├── TossPaymentService.php (9.4KB) - 결제 비즈니스 로직
└── TossApiClient.php (6.0KB) - Toss API 클라이언트
```

#### 8. Repositories (1개)

```
app/Repositories/Payment/
└── PaymentRepository.php (3.5KB) - 결제 데이터 접근
```

#### 9. Events (3개)

```
app/Events/Payment/
├── PaymentCompleted.php (415B) - 결제 완료 이벤트
├── PaymentFailed.php (443B) - 결제 실패 이벤트
└── PaymentCancelled.php (449B) - 결제 취소 이벤트
```

#### 10. Listeners (2개)

```
app/Listeners/Payment/
├── SendPaymentConfirmationEmail.php (884B) - 결제 완료 이메일
└── UpdateOrderStatus.php (980B) - 주문 상태 업데이트
```

#### 11. Jobs (1개)

```
app/Jobs/Payment/
└── ProcessTossWebhook.php (4.5KB) - 웹훅 비동기 처리
```

#### 12. Exceptions (1개)

```
app/Exceptions/Payment/
└── TossPaymentException.php (3.6KB) - 결제 예외 처리
```

### ⚙️ 설정 파일

#### Config (1개)

```
config/
└── toss.php (1.3KB) - Toss Payments 설정
```

#### Routes (1개)

```
routes/
└── payment_routes.php (1.6KB) - 결제 라우트 정의
```

#### Providers (1개)

```
app/Providers/
└── EventServiceProvider.php (1.4KB) - 이벤트 리스너 매핑
```

### 🗄️ Database (2개)

```
database/migrations/
├── create_payments_table.php (2.8KB) - 결제 테이블
└── create_payment_transactions_table.php (1.1KB) - 트랜잭션 테이블
```

### 🧪 Tests (1개)

```
tests/Feature/Payment/
└── TossPaymentTest.php (6.5KB) - Feature 테스트
```

### 🎨 Frontend 예제 (2개)

```
public/ (or any frontend directory)
├── payment_example.html (8.2KB) - 결제 요청 예제
└── payment_success.html (8.4KB) - 결제 성공 페이지
```

## 📋 파일별 상세 설명

### Core Business Logic

#### TossPaymentService.php

-   **역할:** 결제 관련 비즈니스 로직 처리
-   **주요 메서드:**
    -   `prepare()` - 결제 준비
    -   `confirm()` - 결제 승인
    -   `cancel()` - 결제 취소
    -   `getPaymentDetails()` - 결제 조회

#### TossApiClient.php

-   **역할:** Toss Payments API 통신
-   **주요 메서드:**
    -   `confirmPayment()` - 결제 승인 API 호출
    -   `getPayment()` - 결제 조회 API 호출
    -   `cancelPayment()` - 결제 취소 API 호출
    -   `requestVirtualAccount()` - 가상계좌 발급
    -   `requestBillingKey()` - 자동결제 빌링키 발급

### Data Layer

#### Payment.php (Model)

-   **주요 속성:**
    -   결제 정보 (order_id, payment_key, status, amount 등)
    -   고객 정보 (customer_name, email, phone)
    -   카드 정보 (card_company, card_number)
-   **주요 메서드:**
    -   `isCompleted()` - 결제 완료 여부
    -   `isCancelable()` - 취소 가능 여부
    -   `getCancelableAmount()` - 취소 가능 금액

#### PaymentRepository.php

-   **주요 메서드:**
    -   `create()`, `find()`, `update()`, `delete()`
    -   `findByOrderId()`, `findByPaymentKey()`
    -   `getUserPayments()` - 사용자 결제 목록
    -   `getStatistics()` - 결제 통계

### API Layer

#### TossPaymentController.php

-   **엔드포인트:**
    -   `POST /payments/prepare` - 결제 준비
    -   `POST /payments/confirm` - 결제 승인
    -   `GET /payments/{orderId}` - 결제 조회
    -   `POST /payments/{orderId}/cancel` - 결제 취소
    -   `GET /payments` - 결제 목록

#### TossWebhookController.php

-   **엔드포인트:**
    -   `POST /payments/webhook/toss` - Toss 웹훅 수신
-   **처리 이벤트:**
    -   PAYMENT.CONFIRMATION_COMPLETED
    -   PAYMENT.STATUS_CHANGED
    -   VIRTUAL_ACCOUNT.DEPOSIT_COMPLETED

### Event System

#### Events (이벤트 발행)

-   **PaymentCompleted** - 결제 완료 시
-   **PaymentFailed** - 결제 실패 시
-   **PaymentCancelled** - 결제 취소 시

#### Listeners (이벤트 처리)

-   **SendPaymentConfirmationEmail** - 결제 완료 이메일 발송
-   **UpdateOrderStatus** - 주문 상태 업데이트
-   추가 리스너 쉽게 등록 가능

### Security

#### VerifyTossWebhookSignature.php

-   **기능:** 웹훅 서명 검증
-   **방식:** HMAC SHA256
-   **목적:** 위조된 웹훅 요청 차단

#### Form Requests (검증)

-   입력 데이터 검증
-   커스텀 에러 메시지
-   비즈니스 룰 검증

### Configuration

#### toss.php

```php
- client_key - 클라이언트 키
- secret_key - 시크릿 키
- api_url - API 엔드포인트
- success_url - 성공 리다이렉트 URL
- fail_url - 실패 리다이렉트 URL
- webhook_secret - 웹훅 검증 시크릿
- auto_execute - 자동 승인 여부
```

## 🎯 사용 우선순위

### 1단계: 필수 설정 파일

1. `config/toss.php`
2. `database/migrations/*`
3. `routes/payment_routes.php`
4. `.env` 설정

### 2단계: 핵심 비즈니스 로직

1. `TossPaymentService.php`
2. `TossApiClient.php`
3. `PaymentRepository.php`
4. Models (Payment, PaymentTransaction)

### 3단계: API 레이어

1. Controllers
2. Form Requests
3. API Resources
4. Middleware

### 4단계: 이벤트 시스템

1. Events
2. Listeners
3. Jobs

### 5단계: 테스트

1. `TossPaymentTest.php`

### 6단계: 프론트엔드 (선택)

1. `payment_example.html`
2. `payment_success.html`

## 📦 의존성

### Required (필수)

```json
{
    "php": "^8.2",
    "laravel/framework": "^11.0|^12.0",
    "laravel/sanctum": "^4.0",
    "guzzlehttp/guzzle": "^7.0"
}
```

### Recommended (권장)

```json
{
    "predis/predis": "^2.0", // Redis for Queue
    "laravel/horizon": "^5.0" // Queue Monitoring
}
```

## 🔧 커스터마이징 포인트

### 1. 이벤트 리스너 추가

`EventServiceProvider.php`에 새 리스너 추가:

```php
PaymentCompleted::class => [
    SendPaymentConfirmationEmail::class,
    UpdateOrderStatus::class,
    YourCustomListener::class, // 여기에 추가
],
```

### 2. 검증 룰 수정

Form Request 파일에서 `rules()` 메서드 수정

### 3. API 응답 포맷 변경

API Resource 파일에서 `toArray()` 메서드 수정

### 4. 추가 결제 수단

`PaymentMethod.php` enum에 새 케이스 추가

### 5. 추가 결제 상태

`PaymentStatus.php` enum에 새 케이스 추가

## 📊 파일 크기 통계

-   **총 파일 수:** 31개
-   **총 코드 라인:** 약 2,500 라인
-   **총 크기:** 약 130KB
-   **문서 크기:** 약 40KB
-   **코드 크기:** 약 90KB

## 🎓 학습 순서 추천

### 초보자

1. README.md 읽기
2. INSTALLATION.md 따라하기
3. payment_example.html 테스트
4. TossPaymentController 분석
5. TossPaymentService 분석

### 중급자

1. ARCHITECTURE.md 읽기
2. Service Layer 패턴 이해
3. Repository 패턴 이해
4. Event-Driven 구조 이해
5. 테스트 코드 분석

### 고급자

1. 전체 아키텍처 분석
2. 보안 메커니즘 검토
3. 성능 최적화 포인트 파악
4. 커스터마이징 및 확장

## 📞 추가 리소스

-   [Toss Payments 공식 문서](https://docs.tosspayments.com/)
-   [Laravel 공식 문서](https://laravel.com/docs)
-   [PSR 표준](https://www.php-fig.org/psr/)

---

**생성 일자:** 2025년 10월 28일
**버전:** 1.0.0
**호환 Laravel 버전:** 11.x, 12.x
