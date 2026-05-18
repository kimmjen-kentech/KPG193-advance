/**
 * Vercel Edge Middleware: PIN 게이트.
 * 인증 쿠키가 없거나 잘못되면 /pin으로 리다이렉트.
 * 정적 자산, /pin, /api/auth/pin은 우회.
 */
export const config = {
  // 정적 자산과 인증 경로는 미들웨어 우회
  matcher: [
    '/((?!api/auth/pin|pin|assets/|_vercel|favicon|vite\\.svg|icons\\.svg|404\\.html).*)',
  ],
};

const COOKIE_NAME = 'kpg193_access';

const toHex = (buf: ArrayBuffer): string =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const sha256 = async (s: string): Promise<string> => {
  const data = new TextEncoder().encode(s);
  return toHex(await crypto.subtle.digest('SHA-256', data));
};

const parseCookie = (header: string | null, name: string): string | null => {
  if (!header) return null;
  const m = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
};

export default async function middleware(request: Request): Promise<Response> {
  const ACCESS_DIGITS = process.env.ACCESS_DIGITS ?? '';
  const ACCESS_TEXT = (process.env.ACCESS_TEXT ?? '').toLowerCase();

  // 환경변수 미설정 시 게이트 비활성화 (개발 편의)
  if (!ACCESS_DIGITS || !ACCESS_TEXT) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  const expected = await sha256(ACCESS_DIGITS + ACCESS_TEXT);
  const token = parseCookie(request.headers.get('cookie'), COOKIE_NAME);

  if (token === expected) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  const url = new URL(request.url);
  const nextPath = url.pathname + url.search;
  const redirect = new URL('/pin', url);
  redirect.searchParams.set('next', nextPath);
  return Response.redirect(redirect, 302);
}
