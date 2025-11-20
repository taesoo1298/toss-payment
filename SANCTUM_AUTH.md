# Sanctum 토큰 기반 인증 설정

이 프로젝트는 Laravel Sanctum의 API 토큰 인증을 사용하여 결제 API를 보호합니다.

## 작동 방식

### 1. 로그인 시 토큰 생성

사용자가 로그인하면 `AuthenticatedSessionController`에서 자동으로 API 토큰을 생성합니다:

```php
// app/Http/Controllers/Auth/AuthenticatedSessionController.php
$user = Auth::user();
$token = $user->createToken('web-app')->plainTextToken;
session(['api_token' => $token]);
```

### 2. 토큰을 클라이언트로 전달

`HandleInertiaRequests` 미들웨어가 모든 Inertia 페이지에 토큰을 공유합니다:

```php
// app/Http/Middleware/HandleInertiaRequests.php
'auth' => [
    'user' => $request->user(),
    'token' => $request->session()->get('api_token'),
],
```

### 3. 클라이언트에서 토큰 저장

`app.tsx`에서 Inertia가 로드될 때 토큰을 localStorage에 자동 저장합니다:

```typescript
// resources/js/app.tsx
const token = (props.initialPage.props as any)?.auth?.token;
if (token) {
    localStorage.setItem('api_token', token);
}
```

### 4. API 요청 시 자동 포함

`bootstrap.ts`의 axios 인터셉터가 모든 API 요청에 토큰을 자동으로 추가합니다:

```typescript
// resources/js/bootstrap.ts
window.axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('api_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

## 보호된 라우트

### Web 라우트 (Session 기반)
- `/payments/create` - 결제 생성 페이지
- `/payments/success` - 결제 완료 페이지
- `/payments/fail` - 결제 실패 페이지

### API 라우트 (Token 기반)
- `POST /api/payments/prepare` - 결제 준비
- `POST /api/payments/confirm` - 결제 승인
- `GET /api/payments/{orderId}` - 결제 조회
- `POST /api/payments/{orderId}/cancel` - 결제 취소
- `GET /api/payments` - 결제 내역

## 사용 예제

### 결제 페이지에서 API 호출

```typescript
// resources/js/Pages/Payment/Create.tsx
const response = await window.axios.post('/api/payments/prepare', {
    order_name: '테스트 상품',
    amount: 10000,
    method: 'card',
    customer_name: '홍길동',
    customer_email: 'test@example.com',
});
// Authorization 헤더는 자동으로 추가됨
```

### 결제 승인

```typescript
// resources/js/Pages/Payment/Success.tsx
const response = await window.axios.post('/api/payments/confirm', {
    payment_key: paymentKey,
    order_id: orderId,
    amount: parseInt(amount),
});
// Authorization 헤더는 자동으로 추가됨
```

## 로그아웃

로그아웃 시 서버에서 모든 토큰이 자동으로 삭제됩니다:

```php
// app/Http/Controllers/Auth/AuthenticatedSessionController.php
if (Auth::check()) {
    Auth::user()->tokens()->delete();
}
```

클라이언트의 localStorage도 자동으로 정리됩니다.

## 보안 고려사항

1. **토큰 저장**: localStorage에 저장하므로 XSS 공격에 주의
2. **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS 사용
3. **토큰 만료**: 필요시 토큰에 만료 시간 설정 고려
4. **CORS 설정**: API 호출 시 적절한 CORS 설정 필요

## 설정 확인

User 모델에 `HasApiTokens` trait이 포함되어 있는지 확인:

```php
// app/Models/User.php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    // ...
}
```

## TypeScript 타입

토큰은 PageProps 타입에 포함되어 있습니다:

```typescript
// resources/js/types/index.d.ts
export type PageProps<T = Record<string, unknown>> = T & {
    auth: {
        user: User;
        token?: string;
    };
};
```

## 문제 해결

### 401 Unauthorized 오류

1. 로그인이 되어있는지 확인
2. localStorage에 토큰이 있는지 확인: `localStorage.getItem('api_token')`
3. axios 인터셉터가 작동하는지 브라우저 개발자 도구의 Network 탭에서 확인
4. API 라우트에 `auth:sanctum` 미들웨어가 적용되어 있는지 확인

### 토큰이 저장되지 않음

1. 로그인 후 페이지를 새로고침해보기
2. 브라우저 콘솔에서 에러 확인
3. `session(['api_token' => $token])`이 제대로 실행되는지 확인
