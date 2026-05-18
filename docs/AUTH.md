# Access Gate (PIN 인증)

KPG 193 사이트는 임시 PIN 게이트로 보호됩니다. 모든 페이지·데이터 파일은
유효한 액세스 코드 없이는 접근할 수 없습니다.

## 동작 흐름

```
사용자가 임의 경로 진입
        │
        ▼
[Vercel Edge Middleware]
   kpg193_access 쿠키 검사
        │
   ┌────┴────┐
   │         │
 일치       불일치/없음
   │         │
 통과   →  /pin?next=원래경로 리다이렉트
            │
            ▼
        [PIN 입력 페이지]
        숫자 4자리 + 텍스트
            │
            ▼
        POST /api/auth/pin
            │
            ▼
        [Vercel Edge Function]
        ACCESS_DIGITS + ACCESS_TEXT 비교
            │
        일치 시 SHA-256 토큰을
        httpOnly Secure 쿠키로 30일 저장
            │
            ▼
        next 경로로 full reload
```

## 비밀번호 설정 (Vercel)

1. https://vercel.com/<team>/kpg-193-advance/settings/environment-variables
2. 두 변수 추가:
   - `ACCESS_DIGITS` — 4자리 숫자 (예: `2026`)
   - `ACCESS_TEXT` — 추가 문자열 (예: `kpg193`. 비교 시 소문자로 통일)
3. **All Environments**(Production / Preview / Development) 모두 체크
4. Redeploy → 적용 완료

## 비밀번호 변경

1. Vercel 환경변수 값 수정
2. **Deployments → 최신 배포 → Redeploy** (코드 변경 불필요)
3. 기존 쿠키는 자동 무효화 (해시 불일치)

## 게이트 해제 (서비스 공개 전환)

방법 1 — **환경변수 제거**:
- Vercel에서 `ACCESS_DIGITS` 또는 `ACCESS_TEXT` 둘 중 하나라도 비우면
  middleware가 게이트를 자동 비활성화한다 (`next()` 반환).

방법 2 — **미들웨어 비활성화**:
- `middleware.ts` 파일 삭제 또는 이름 변경 (`middleware.ts.disabled`)
- 재배포

방법 3 — **matcher 비우기**:
```ts
export const config = { matcher: [] };
```

## 보호 범위

미들웨어 matcher 패턴:
```
/((?!api/auth/pin|pin|assets/|_vercel|favicon|vite\.svg|icons\.svg|404\.html).*)
```

**보호되는 경로**: `/`, `/network`, `/profiles`, `/data`, `/methodology`,
`/guide`, `/data/*.parquet`, 그 외 모든 페이지/데이터

**우회되는 경로**:
- `/pin` (PIN 입력)
- `/api/auth/pin` (인증 API)
- `/assets/*` (Vite 빌드 자산 — 해시 파일명이라 자체 보호)
- `/_vercel/*` (Vercel 내부)
- `/favicon*`, `/vite.svg`, `/icons.svg`, `/404.html`

## 보안 특성

- **쿠키**: `httpOnly` + `Secure` + `SameSite=Lax` + `Max-Age=30d`
- **토큰**: `SHA-256(ACCESS_DIGITS + ACCESS_TEXT)` (평문 비밀번호 미저장)
- **서버 검증**: Vercel Edge Function이 평문 비교 수행 (브라우저로 전송된
  비밀번호는 응답 후 메모리에서 소실)
- **제한**: 단일 공유 비밀번호. 사용자별 추적·차등 권한 없음

## 파일 구조

```
KPG193-advance/
├── api/
│   └── auth/
│       └── pin.ts            ← Vercel Edge Function (POST 검증)
├── middleware.ts             ← Vercel Edge Middleware (쿠키 검사)
├── vercel.json               ← rewrites + headers
├── docs/
│   └── AUTH.md               ← 이 문서
└── frontend/
    └── src/
        ├── pages/PinPage.tsx ← PIN 입력 UI
        └── App.tsx           ← /pin 라우트 등록
```

## 로컬 개발

Vite dev server(`pnpm dev`) 단독으로는 middleware/function이 실행되지
않으므로 **인증 우회**된다.

미들웨어 동작을 로컬에서 테스트하려면:
```bash
pnpm add -g vercel
vercel dev
```
`.env.local`에 환경변수를 두면 vercel dev가 자동으로 읽는다.

## 기억할 것

- 비밀번호는 Vercel 환경변수에만 둔다. 코드에 평문 저장 금지.
- 쿠키 만료는 30일. 더 짧게 하려면 `api/auth/pin.ts`의 `MAX_AGE_SEC` 수정.
- 게이트는 임시 조치다. 데이터셋 공개 전환 시 위 "게이트 해제" 절차로 제거.
