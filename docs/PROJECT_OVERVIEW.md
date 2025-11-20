# Dr.Smile 이커머스 프로젝트 개요

## 프로젝트 정보

-   **프로젝트명**: Dr.Smile 치약 이커머스 플랫폼
-   **목표**: 치과의사가 만든 프리미엄 치약 온라인 판매
-   **기술 스택**: Laravel 12 + React 18 + TypeScript + Toss Payments
-   **시작일**: 2025-11-04
-   **목표 오픈일**: TBD

## 프로젝트 구조

```
docs/
├── PROJECT_OVERVIEW.md              # 이 파일 (프로젝트 개요)
├── 01_PRODUCT_MANAGEMENT.md         # 상품 등록 및 관리
├── 02_SHIPPING_SYSTEM.md            # 배송 시스템
├── 03_LEGAL_REQUIREMENTS.md         # 법적 요구사항
├── 04_MARKETING_STRATEGY.md         # 마케팅 및 홍보
├── 05_CUSTOMER_SERVICE.md           # 고객 서비스
├── IMPLEMENTATION_CHECKLIST.md      # 전체 구현 체크리스트
└── SPECIFICATIONS.md                # 기술 명세서 (기존)
```

## 주요 기능 영역

### 1️⃣ 상품 관리

-   [ ] 상품 등록 시스템
-   [ ] 카테고리 관리
-   [ ] 재고 관리
-   [ ] 이미지 관리

### 2️⃣ 배송 시스템

-   [ ] 택배사 연동
-   [ ] 배송비 정책
-   [ ] 송장 관리
-   [ ] 배송 추적

### 3️⃣ 법적 준비

-   [ ] 이용약관
-   [ ] 개인정보처리방침
-   [ ] 의약외품 규정

### 4️⃣ 마케팅

-   [ ] SEO 최적화
-   [ ] 프로모션 기획
-   [ ] 광고 전략

### 5️⃣ 고객 서비스

-   [ ] 고객센터 구축
-   [ ] 교환/환불 정책
-   [ ] FAQ 시스템
-   [ ] 리뷰 관리

## 프로젝트 우선순위

### Phase 1: 핵심 기능 (필수)

1. 상품 등록 및 관리 시스템
2. 결제 시스템 (완료 ✅)
3. 주문 관리 시스템
4. 기본 법적 문서

### Phase 2: 운영 필수 (중요)

1. 배송 시스템 구축
2. 고객센터 구축
3. 교환/환불 시스템
4. 재고 관리

### Phase 3: 성장 단계 (선택)

1. 마케팅 자동화
2. 고급 리뷰 시스템
3. 로열티 프로그램
4. 모바일 앱

## 현재 구현 상태

### ✅ 완료된 기능

-   [x] 사용자 인증 (회원가입, 로그인)
-   [x] Toss Payments 결제 연동
-   [x] 결제 페이지 (Checkout)
-   [x] 주문 완료 페이지
-   [x] 마이페이지 레이아웃
-   [x] 쿠폰 관리 페이지
-   [x] 배송지 관리 페이지

### 🚧 진행 중인 기능

-   [ ] 상품 CRUD API
-   [ ] 상품 목록 페이지
-   [ ] 상품 상세 페이지
-   [ ] 장바구니 기능

### 📋 계획된 기능

-   [ ] 리뷰 시스템
-   [ ] 주문 관리 API
-   [ ] 배송 추적 시스템
-   [ ] 관리자 대시보드

## 다음 단계 (Next Steps)

### 이번 주 목표

1. **상품 관리 시스템 구축** ([01_PRODUCT_MANAGEMENT.md](01_PRODUCT_MANAGEMENT.md) 참조)

    - Database 마이그레이션
    - Product API 구현
    - Admin 상품 등록 페이지

2. **상품 이미지 관리**

    - S3/CloudFront 설정
    - 이미지 업로드 기능
    - 썸네일 생성

3. **법적 문서 준비** ([03_LEGAL_REQUIREMENTS.md](03_LEGAL_REQUIREMENTS.md) 참조)
    - 이용약관 초안
    - 개인정보처리방침 초안

### 이번 달 목표

1. 상품 등록 완료 (최소 20개 제품)
2. 장바구니 및 주문 시스템 완성
3. 배송 시스템 기본 구축
4. 법적 문서 완성 및 게시

## 관련 문서

-   [기술 명세서 (SPECIFICATIONS.md)](../SPECIFICATIONS.md)
-   [구현 체크리스트 (IMPLEMENTATION_CHECKLIST.md)](IMPLEMENTATION_CHECKLIST.md)
-   [관리자 페이지 규칙 (admin-page-rules.md)](admin-page-rules.md)

---

**최종 업데이트**: 2025-11-20
**작성자**: Development Team
**버전**: 1.0
