# Toss Payment 로직 분석 보고서

## 📊 전체 구조 분석

### ✅ 잘 구현된 부분

#### 1. **아키텍처 설계**
- ✅ Repository 패턴 사용으로 데이터 접근 로직 분리
- ✅ Service 레이어로 비즈니스 로직 캡슐화
- ✅ API Client 분리로 외부 API 통신 추상화
- ✅ Enum 사용으로 타입 안전성 확보
- ✅ Resource 클래스로 API 응답 일관성 유지

#### 2. **보안 및 인증**
- ✅ Sanctum 토큰 기반 API 인증
- ✅ CSRF 보호 (axios 자동 설정)
- ✅ Form Request Validation으로 입력값 검증
- ✅ 금액 검증 (prepare 시점 & confirm 시점 이중 검증)
- ✅ 사용자 권한 검증 (결제 취소 시 user_id 확인)

#### 3. **데이터베이스 설계**
- ✅ 적절한 인덱스 설정 (order_id, payment_key, user_id, status 등)
- ✅ Soft Delete 지원으로 데이터 복구 가능
- ✅ JSON 메타데이터 필드로 확장성 확보
- ✅ Transaction 테이블로 이력 추적

#### 4. **에러 핸들링**
- ✅ 커스텀 Exception (TossPaymentException)
- ✅ 상세한 로깅 (prepare, confirm, cancel 각 단계)
- ✅ DB 트랜잭션으로 데이터 일관성 보장
- ✅ 실패 시 상태 업데이트 및 이벤트 발생

#### 5. **프론트엔드 구현**
- ✅ TypeScript로 타입 안전성 확보
- ✅ Inertia.js로 SPA 경험 제공
- ✅ 에러 메시지 사용자 친화적 표시
- ✅ 로딩 상태 UI 처리

## ⚠️ 발견된 문제점 및 개선사항

### 🔴 중요 문제

#### 1. **TossPaymentService::prepare() - method 값 누락**
```php
// 현재 코드 (app/Services/Payment/TossPaymentService.php:49-57)
return [
    'order_id' => $orderId,
    'order_name' => $payment->order_name,
    'amount' => $payment->total_amount,
    'customer_name' => $payment->customer_name,
    'customer_email' => $payment->customer_email,
    'success_url' => config('toss.success_url'),
    'fail_url' => config('toss.fail_url'),
];
```

**문제**: `method` 값이 반환되지 않아 프론트엔드에서 `data.method`가 undefined

**해결**:
```php
return [
    'order_id' => $orderId,
    'order_name' => $payment->order_name,
    'amount' => $payment->total_amount,
    'method' => $payment->method->value,  // 추가 필요
    'customer_name' => $payment->customer_name,
    'customer_email' => $payment->customer_email,
    'success_url' => config('toss.success_url'),
    'fail_url' => config('toss.fail_url'),
];
```

#### 2. **프론트엔드 결제 수단 매핑 오류**
```typescript
// resources/js/Pages/Payment/Create.tsx:60-66
const methodMap: Record<string, string> = {
    card: "카드",
    virtual_account: "가상계좌",
    transfer: "계좌이체",
    mobile_phone: "휴대폰",
    easy_pay: "간편결제",
};
```

**문제**: Toss Payments API는 영문 값을 요구하는데 한글로 전달

**해결**: Toss SDK 문서에 따라 올바른 값으로 수정 필요
```typescript
const methodMap: Record<string, string> = {
    card: "카드",
    virtual_account: "가상계좌",
    transfer: "계좌이체",
    mobile_phone: "휴대폰",
    easy_pay: "간편결제",
};

// Toss SDK 호출 시
await tossPayments.requestPayment(data.method, {  // 영문 값 그대로 사용
    // ...
});
```

또는 SDK에서 한글을 요구한다면 현재 구현이 맞지만, 공식 문서 확인 필요.

#### 3. **환경 변수 검증 누락**
```php
// config/toss.php
'client_key' => env('TOSS_CLIENT_KEY'),  // null일 수 있음
'secret_key' => env('TOSS_SECRET_KEY'),  // null일 수 있음
```

**문제**: 필수 환경 변수가 없어도 에러 없이 진행

**해결**: AppServiceProvider에서 검증 추가
```php
if (app()->environment('production')) {
    if (!config('toss.secret_key')) {
        throw new \RuntimeException('TOSS_SECRET_KEY is not configured');
    }
}
```

### 🟡 개선 권장사항

#### 1. **Service Provider 등록**
현재 TossApiClient와 TossPaymentService가 자동 바인딩되지만, 명시적 등록 권장

```php
// app/Providers/AppServiceProvider.php
public function register()
{
    $this->app->singleton(TossApiClient::class);
    $this->app->singleton(TossPaymentService::class);
}
```

#### 2. **프론트엔드 환경 변수 검증**
```typescript
// resources/js/Pages/Payment/Create.tsx
const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

if (!TOSS_CLIENT_KEY) {
    throw new Error('VITE_TOSS_CLIENT_KEY is not configured');
}
```

#### 3. **금액 계산 로직 개선**
```php
// PaymentPrepareRequest.php:59-67
protected function prepareForValidation(): void
{
    if ($this->has(['amount', 'tax_free_amount'])) {
        $taxableAmount = $this->amount - ($this->tax_free_amount ?? 0);

        // 소수점 처리 명확히
        $this->merge([
            'supplied_amount' => (int) floor($taxableAmount / 1.1),
            'vat' => (int) floor($taxableAmount - floor($taxableAmount / 1.1)),
        ]);
    }
}
```

#### 4. **타임아웃 처리 추가**
프론트엔드에서 장시간 대기 시 타임아웃 처리

```typescript
// Create.tsx
const TIMEOUT = 30000; // 30초
const timeoutId = setTimeout(() => {
    setMessage({
        text: '결제 요청 시간이 초과되었습니다.',
        type: 'error'
    });
    setProcessing(false);
}, TIMEOUT);

try {
    const response = await window.axios.post('/api/payments/prepare', formData);
    clearTimeout(timeoutId);
    // ...
}
```

#### 5. **중복 결제 방지**
```php
// TossPaymentService::prepare()
public function prepare(array $data): array
{
    // 최근 5분 이내 동일 금액/주문명 결제 확인
    $recentPayment = $this->paymentRepository->findRecentPayment(
        auth()->id(),
        $data['order_name'],
        $data['amount'],
        now()->subMinutes(5)
    );

    if ($recentPayment && $recentPayment->isPending()) {
        throw new TossPaymentException(
            '동일한 결제가 이미 진행 중입니다.',
            'DUPLICATE_PAYMENT'
        );
    }

    // 기존 로직...
}
```

#### 6. **Webhook 검증 미들웨어 확인**
```php
// app/Http/Middleware/VerifyTossWebhookSignature.php 파일 존재 확인 필요
// routes/api/payment_routes.php:24에서 사용 중
```

#### 7. **PaymentTransaction 상수 정의**
```php
// 현재 코드에서 문자열로 사용
PaymentTransaction::TYPE_PAYMENT
PaymentTransaction::TYPE_CANCEL
PaymentTransaction::TYPE_PARTIAL_CANCEL

// 해당 상수들이 PaymentTransaction 모델에 정의되어 있는지 확인 필요
```

## 📝 테스트 체크리스트

### Backend 테스트
- [ ] 결제 준비 (prepare) - 정상 케이스
- [ ] 결제 준비 - 필수값 누락 검증
- [ ] 결제 준비 - 금액 범위 검증 (min: 100, max: 10,000,000)
- [ ] 결제 승인 (confirm) - 정상 케이스
- [ ] 결제 승인 - 금액 불일치 검증
- [ ] 결제 승인 - 이미 승인된 결제 처리
- [ ] 결제 취소 (cancel) - 전액 취소
- [ ] 결제 취소 - 부분 취소
- [ ] 결제 취소 - 권한 검증 (다른 사용자 결제 취소 시도)
- [ ] 결제 취소 - 취소 불가능 상태 검증
- [ ] Toss API 실패 시 에러 핸들링
- [ ] DB 트랜잭션 롤백 확인

### Frontend 테스트
- [ ] 로그인 사용자만 접근 가능
- [ ] 폼 validation (필수값, 형식 검증)
- [ ] API 토큰 자동 포함 확인
- [ ] 결제 진행 중 중복 클릭 방지
- [ ] Toss SDK 로드 실패 처리
- [ ] 결제 성공 시 자동 승인 및 결과 표시
- [ ] 결제 실패 시 에러 메시지 표시
- [ ] 네트워크 오류 처리

### 통합 테스트
- [ ] 결제 전체 플로우 (준비 → SDK → 승인)
- [ ] 가상계좌 플로우
- [ ] 간편결제 플로우
- [ ] 동시 결제 요청 처리
- [ ] 세션 만료 시 처리

## 🔧 즉시 수정이 필요한 코드

### 1. TossPaymentService.php
```php
// Line 49-57
return [
    'order_id' => $orderId,
    'order_name' => $payment->order_name,
    'amount' => $payment->total_amount,
    'method' => $payment->method->value,  // ← 추가
    'customer_name' => $payment->customer_name,
    'customer_email' => $payment->customer_email,
    'success_url' => config('toss.success_url'),
    'fail_url' => config('toss.fail_url'),
];
```

### 2. Create.tsx (선택사항 - Toss SDK 문서 확인 필요)
```typescript
// Line 69-80
// 방법 1: 한글 매핑 제거하고 영문 그대로 사용
await tossPayments.requestPayment(data.method, {
    amount: data.amount,
    orderId: data.order_id,
    orderName: data.order_name,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    successUrl: window.location.origin + "/payments/success",
    failUrl: window.location.origin + "/payments/fail",
});

// 또는 방법 2: Toss SDK가 한글을 요구한다면 현재대로 유지
```

## 📈 성능 최적화 제안

1. **DB 쿼리 최적화**
   - `Payment::with('transactions')` - N+1 방지 잘 되어 있음
   - 통계 쿼리 시 인덱스 활용 확인

2. **캐싱 전략**
   - 결제 상태 조회 시 짧은 TTL 캐시 적용 고려
   - 사용자별 결제 내역 캐싱

3. **비동기 처리**
   - 이벤트 리스너로 알림 발송 비동기 처리
   - 큐 사용 권장 (이미 설정됨)

## 🎯 결론

**전체 평가**: ⭐⭐⭐⭐ (4/5)

### 강점
- 체계적인 아키텍처 설계
- 보안 및 검증 로직 충실
- 에러 핸들링 및 로깅 양호
- 타입 안전성 확보

### 개선 필요
- **준비 API 응답에 method 누락** (즉시 수정 필요)
- Toss SDK 호출 방식 검증 필요
- 환경 변수 검증 추가
- 중복 결제 방지 로직 고려

### 권장 사항
1. 위에서 언급한 "즉시 수정이 필요한 코드" 적용
2. 테스트 코드 작성 (PHPUnit/Pest)
3. E2E 테스트로 전체 플로우 검증
4. 프로덕션 배포 전 Toss 테스트 환경에서 충분한 테스트

---

**작성일**: 2025-10-28
**분석 대상**: Laravel 12 + Inertia.js + React + Toss Payments Integration
