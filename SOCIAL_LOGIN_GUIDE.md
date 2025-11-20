# 소셜 로그인 설정 가이드

Dr.Smile 프로젝트에서 Google, Kakao, Naver 소셜 로그인을 설정하는 방법입니다.

## 목차
1. [Google OAuth 설정](#google-oauth-설정)
2. [Kakao OAuth 설정](#kakao-oauth-설정)
3. [Naver OAuth 설정](#naver-oauth-설정)
4. [환경 변수 설정](#환경-변수-설정)
5. [테스트](#테스트)

---

## Google OAuth 설정

### 1. Google Cloud Console 접속
[Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.

### 2. 프로젝트 생성
- 새 프로젝트를 만들거나 기존 프로젝트를 선택합니다.

### 3. OAuth 동의 화면 구성
- **API 및 서비스 > OAuth 동의 화면** 메뉴로 이동
- 사용자 유형: **외부** 선택 (테스트용)
- 앱 정보 입력:
  - 앱 이름: `Dr.Smile`
  - 사용자 지원 이메일: 본인 이메일
  - 개발자 연락처 정보: 본인 이메일
- 범위: 기본값 사용 (email, profile, openid)
- 저장 후 계속

### 4. OAuth 클라이언트 ID 생성
- **API 및 서비스 > 사용자 인증 정보** 메뉴로 이동
- **사용자 인증 정보 만들기 > OAuth 클라이언트 ID** 클릭
- 애플리케이션 유형: **웹 애플리케이션**
- 승인된 리디렉션 URI:
  ```
  http://localhost:8000/auth/google/callback
  ```
- 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀**을 복사

---

## Kakao OAuth 설정

### 1. Kakao Developers 접속
[Kakao Developers](https://developers.kakao.com/)에 접속하고 로그인합니다.

### 2. 애플리케이션 추가
- **내 애플리케이션** 메뉴로 이동
- **애플리케이션 추가하기** 클릭
- 앱 이름: `Dr.Smile`
- 사업자명: 개인 이름 입력
- 저장

### 3. 앱 키 확인
- **앱 설정 > 요약 정보**에서 REST API 키 확인

### 4. 플랫폼 설정
- **앱 설정 > 플랫폼** 메뉴로 이동
- **Web 플랫폼 등록** 클릭
- 사이트 도메인:
  ```
  http://localhost:8000
  ```

### 5. Redirect URI 설정
- **제품 설정 > Kakao 로그인** 메뉴로 이동
- **Kakao 로그인 활성화** ON
- **Redirect URI** 등록:
  ```
  http://localhost:8000/auth/kakao/callback
  ```

### 6. 동의 항목 설정
- **제품 설정 > Kakao 로그인 > 동의 항목** 메뉴로 이동
- 필수 동의 항목:
  - 닉네임
  - 프로필 사진
  - 카카오계정(이메일)

### 7. Client Secret 발급 (선택)
- **제품 설정 > Kakao 로그인 > 보안** 메뉴로 이동
- **Client Secret** 코드 생성
- 활성화 상태로 변경

---

## Naver OAuth 설정

### 1. Naver Developers 접속
[Naver Developers](https://developers.naver.com/)에 접속하고 로그인합니다.

### 2. 애플리케이션 등록
- **Application > 애플리케이션 등록** 메뉴로 이동
- **애플리케이션 등록** 클릭
- 애플리케이션 정보 입력:
  - 애플리케이션 이름: `Dr.Smile`
  - 사용 API: **네아로(네이버 아이디로 로그인)** 선택
  - 서비스 환경: **PC 웹** 추가
  - 서비스 URL:
    ```
    http://localhost:8000
    ```
  - Callback URL:
    ```
    http://localhost:8000/auth/naver/callback
    ```

### 3. 제공 정보 선택
- 회원 이름
- 이메일 주소
- 프로필 사진

### 4. Client ID/Secret 확인
- 등록 완료 후 **애플리케이션 정보**에서 Client ID와 Client Secret 확인

---

## 환경 변수 설정

`.env` 파일에 아래 내용을 추가합니다:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# Kakao OAuth
KAKAO_CLIENT_ID=your_kakao_rest_api_key
KAKAO_CLIENT_SECRET=your_kakao_client_secret  # 선택사항
KAKAO_REDIRECT_URI=http://localhost:8000/auth/kakao/callback

# Naver OAuth
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
NAVER_REDIRECT_URI=http://localhost:8000/auth/naver/callback
```

**주의사항:**
- Kakao의 경우 Client Secret은 선택사항입니다. 사용하지 않으면 비워두세요.
- 프로덕션 환경에서는 `http://localhost:8000`을 실제 도메인으로 변경해야 합니다.

---

## 테스트

### 1. 개발 서버 실행
```bash
composer dev
# 또는
php artisan serve
npm run dev
```

### 2. 로그인 페이지 접속
브라우저에서 `http://localhost:8000/login` 접속

### 3. 소셜 로그인 버튼 확인
- Google로 계속하기
- Kakao로 계속하기
- Naver로 계속하기

### 4. 각 소셜 로그인 테스트
각 버튼을 클릭하여 정상적으로 OAuth 인증 플로우가 진행되는지 확인합니다.

### 5. 콜백 처리 확인
- 소셜 로그인 성공 시 홈페이지(`/`)로 리디렉션
- 사용자 정보가 데이터베이스에 저장되는지 확인
- 프로필 이미지(avatar)가 저장되는지 확인

---

## 구현된 기능

### 백엔드 (Laravel)
- ✅ Laravel Socialite 패키지 설치
- ✅ Socialite Providers (Kakao, Naver) 설치
- ✅ Users 테이블에 소셜 로그인 필드 추가 (provider, provider_id, avatar)
- ✅ SocialAuthController 구현 (Laravel Best Practices)
- ✅ 소셜 인증 라우트 추가 (`/auth/{provider}/redirect`, `/auth/{provider}/callback`)
- ✅ 자동 회원가입 및 계정 연동 기능
- ✅ Sanctum 토큰 발급 (API 인증)

### 프론트엔드 (React + TypeScript)
- ✅ SocialLoginButton 컴포넌트 (Google, Kakao, Naver)
- ✅ 로그인 페이지 UI 개선 (한글화, 소셜 로그인 버튼 추가)
- ✅ 회원가입 페이지 UI 개선 (한글화, 소셜 로그인 버튼 추가)
- ✅ 모던하고 깔끔한 디자인

### 보안 및 Best Practices
- ✅ Provider 검증 (지원되는 provider만 허용)
- ✅ Exception 처리 (소셜 로그인 실패 시 에러 메시지)
- ✅ 이메일 기반 계정 연동 (같은 이메일로 여러 provider 연동)
- ✅ 소셜 로그인 사용자 이메일 자동 인증 (email_verified_at)
- ✅ 비밀번호 nullable 처리 (소셜 로그인 전용 계정)

---

## 문제 해결

### "Provider not supported" 오류
- 라우트에서 사용하는 provider 이름이 올바른지 확인 (google, kakao, naver 중 하나)
- URL이 `/auth/{provider}/redirect` 형식인지 확인

### OAuth 에러 (redirect_uri_mismatch)
- 각 OAuth 플랫폼의 Redirect URI 설정이 정확한지 확인
- `.env` 파일의 REDIRECT_URI와 일치하는지 확인

### 소셜 로그인 후 에러 발생
- 데이터베이스 마이그레이션이 실행되었는지 확인: `php artisan migrate`
- `.env` 파일의 Client ID/Secret이 정확한지 확인
- Laravel 로그 확인: `storage/logs/laravel.log`

### Kakao 이메일 정보를 받을 수 없음
- Kakao Developers에서 **동의 항목**에 이메일이 추가되었는지 확인
- 비즈 앱 전환이 필요할 수 있음 (개인 개발자는 테스트 사용자로 추가)

---

## 프로덕션 배포 시 체크리스트

- [ ] `.env` 파일의 `APP_URL`을 실제 도메인으로 변경
- [ ] 모든 OAuth 플랫폼의 Redirect URI를 프로덕션 URL로 업데이트
- [ ] Google OAuth 동의 화면을 **프로덕션** 모드로 전환
- [ ] HTTPS 설정 (OAuth는 HTTPS 필수)
- [ ] 환경 변수 보안 확인 (`.env` 파일은 git에 커밋하지 않기)

---

## 참고 자료

- [Laravel Socialite 공식 문서](https://laravel.com/docs/11.x/socialite)
- [Socialite Providers](https://socialiteproviders.com/)
- [Google OAuth 가이드](https://developers.google.com/identity/protocols/oauth2)
- [Kakao 로그인 가이드](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Naver 로그인 가이드](https://developers.naver.com/docs/login/api/api.md)
