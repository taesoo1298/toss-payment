# Toss Payments SDK 가이드

## 📚 SDK vs API 구분

### 🖥️ SDK (Software Development Kit)
**위치**: 프론트엔드 (브라우저)
**역할**: 결제 창 띄우기, 사용자 인터랙션 처리
**파일**: `resources/js/Pages/Payment/Create.tsx`

```typescript
// CDN에서 로드 (app.blade.php)
<script src="https://js.tosspayments.com/v2/standard"></script>

// 사용 방법
const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);

await tossPayments.requestPayment({
    method: 'CARD',
    amount: {
        currency: 'KRW',
        value: 10000,
    },
    orderId: 'ORDER_123',
    orderName: '테스트 상품',
    successUrl: '...',
    failUrl: '...',
});
```

### 🔧 API (Application Programming Interface)
**위치**: 백엔드 (서버)
**역할**: 결제 승인, 취소, 조회
**파일**: `app/Services/Payment/TossApiClient.php`

```php
// HTTP 클라이언트로 API 호출
$response = Http::withBasicAuth($this->secretKey, '')
    ->post('https://api.tosspayments.com/v1/payments/confirm', [
        'paymentKey' => $paymentKey,
        'orderId' => $orderId,
        'amount' => $amount,
    ]);
```

## 🔄 전체 결제 플로우

```
┌────────────────────────────────────────────────────────────┐
│ 1. Frontend (SDK)                                          │
│    - 사용자가 결제 버튼 클릭                                  │
│    - POST /api/payments/prepare (백엔드 호출)                │
│    - 주문 정보 받아옴                                         │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│ 2. Toss SDK                                                │
│    - window.TossPayments(clientKey)                        │
│    - requestPayment() 호출                                  │
│    - Toss 결제 창 팝업 (사용자가 카드번호 입력)              │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│ 3. Toss Server                                             │
│    - 사용자 본인인증 처리                                     │
│    - 카드사 승인 요청                                         │
│    - successUrl로 리다이렉트 (paymentKey, orderId, amount)  │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│ 4. Frontend (Success Page)                                 │
│    - /payments/success?paymentKey=xxx&orderId=xxx          │
│    - POST /api/payments/confirm (백엔드 호출)                │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│ 5. Backend (API)                                           │
│    - TossApiClient::confirmPayment()                       │
│    - Toss API 서버에 승인 요청                               │
│    - DB에 결제 정보 저장                                     │
│    - 결과 반환                                               │
└────────────────────────────────────────────────────────────┘
```

## 💻 현재 구현 방식

### ✅ CDN 방식 (현재 사용 중)

**장점**:
- 설정 간단
- 버전 관리 불필요
- 빠른 로딩
- 안정적인 API

**구현**:
```html
<!-- resources/views/app.blade.php -->
<script src="https://js.tosspayments.com/v2/standard"></script>
```

```typescript
// resources/js/Pages/Payment/Create.tsx
declare global {
    interface Window {
        TossPayments: any;
    }
}

const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);
```

### ❌ NPM 패키지 방식 (사용하지 않음)

`@tosspayments/tosspayments-sdk` v2.x는 **Payment Widget SDK**로 API가 다릅니다.

```typescript
// ❌ 작동하지 않음
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
const tossPayments = await loadTossPayments(clientKey);
tossPayments.requestPayment() // ← 이 메서드 없음!
```

v2는 Widget 방식으로 사용법이 완전히 다릅니다:
```typescript
// v2 Widget 방식 (복잡함)
const payment = tossPayments.payment({ ... })
const paymentMethod = tossPayments.paymentMethod({ ... })
// DOM 엘리먼트에 렌더링 필요
```

## 🎯 결제 수단 매핑

### Backend → Frontend
```php
// TossPaymentService.php
private function mapMethodForSdk(string $method): string
{
    return match($method) {
        'card' => 'CARD',
        'virtual_account' => 'VIRTUAL_ACCOUNT',
        'transfer' => 'TRANSFER',
        'mobile_phone' => 'MOBILE_PHONE',
        'easy_pay' => 'EASY_PAY',
        // ...
    };
}
```

### Frontend SDK 사용
```typescript
// Create.tsx
await tossPayments.requestPayment({
    method: data.method, // 'CARD', 'VIRTUAL_ACCOUNT', etc.
    amount: {
        currency: 'KRW',
        value: data.amount,
    },
    // ...
});
```

## 🔑 인증 키

| 키 | 위치 | 용도 |
|---|---|---|
| **Client Key** | Frontend (SDK) | 결제 창 초기화 |
| **Secret Key** | Backend (API) | 결제 승인/취소/조회 |

```bash
# .env
VITE_TOSS_CLIENT_KEY=test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm
TOSS_SECRET_KEY=test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6
```

## 🐛 트러블슈팅

### `tossPayments.requestPayment is not a function`

**원인**: NPM 패키지 `@tosspayments/tosspayments-sdk` v2.x 사용 시 발생

**해결**: CDN 방식 사용
```html
<script src="https://js.tosspayments.com/v2/standard"></script>
```

### SDK가 로드되지 않음

**확인사항**:
1. `app.blade.php`에 CDN 스크립트 포함 확인
2. 브라우저 콘솔에서 `window.TossPayments` 존재 확인
3. 네트워크 탭에서 CDN 로딩 상태 확인

### 결제 수단이 올바르지 않음

**확인사항**:
1. Backend에서 대문자로 변환하는지 확인 (`mapMethodForSdk()`)
2. SDK에 전달되는 값이 `'CARD'`, `'VIRTUAL_ACCOUNT'` 등 대문자인지 확인

## 📖 참고 자료

- [Toss Payments 공식 문서](https://docs.tosspayments.com/)
- [Standard SDK 가이드](https://docs.tosspayments.com/reference/js-sdk)
- [결제창 연동 가이드](https://docs.tosspayments.com/guides/payment-window)

## ✅ 체크리스트

결제 구현 시 확인할 사항:

- [ ] CDN 스크립트가 `app.blade.php`에 포함되어 있는가?
- [ ] `.env`에 `VITE_TOSS_CLIENT_KEY` 설정되어 있는가?
- [ ] `.env`에 `TOSS_SECRET_KEY` 설정되어 있는가?
- [ ] Backend에서 `method` 값을 대문자로 변환하는가?
- [ ] Frontend에서 `window.TossPayments` 존재 확인하는가?
- [ ] `successUrl`, `failUrl`이 올바른가?
- [ ] 테스트 환경 키를 사용하고 있는가?
