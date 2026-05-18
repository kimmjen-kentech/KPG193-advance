/**
 * Vercel Edge Function: PIN 검증 + 쿠키 설정.
 * POST /api/auth/pin  body: { pin: string }
 *   pin = 4자리 숫자 + 추가 문자열 (소문자 비교)
 * 일치 시: SHA-256(digits+text)를 httpOnly 쿠키 'kpg193_access'에 30일 저장
 */

export const config = { runtime: 'edge' };

const COOKIE_NAME = 'kpg193_access';
const MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30일

const toHex = (buf: ArrayBuffer): string =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const sha256 = async (s: string): Promise<string> => {
  const data = new TextEncoder().encode(s);
  return toHex(await crypto.subtle.digest('SHA-256', data));
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let pin = '';
  try {
    const body = (await request.json()) as { pin?: unknown };
    if (typeof body.pin === 'string') pin = body.pin;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ACCESS_DIGITS = process.env.ACCESS_DIGITS ?? '';
  const ACCESS_TEXT = (process.env.ACCESS_TEXT ?? '').toLowerCase();

  if (!ACCESS_DIGITS || !ACCESS_TEXT) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const submittedDigits = pin.slice(0, 4);
  const submittedText = pin.slice(4).toLowerCase().trim();

  if (submittedDigits !== ACCESS_DIGITS || submittedText !== ACCESS_TEXT) {
    return new Response(JSON.stringify({ error: 'Invalid access code' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = await sha256(ACCESS_DIGITS + ACCESS_TEXT);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SEC}; Path=/`,
    },
  });
}
