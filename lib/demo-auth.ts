/**
 * Password gate for client demo deployments. Runs in middleware (edge) and route handlers (node),
 * so it only uses Web Crypto.
 *
 * The cookie never holds the password: it holds HMAC-SHA256(DEMO_PASSWORD, SESSION_LABEL). Rotating
 * DEMO_PASSWORD invalidates every session.
 */
export const DEMO_COOKIE = 'demo_session'
export const DEMO_COOKIE_MAX_AGE = 60 * 60 * 24 * 14 // 14 days
const SESSION_LABEL = 'client-demo-session-v1'

const enc = new TextEncoder()

function hex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Constant-time comparison of two equal-purpose strings. */
export function safeEqual(a: string, b: string): boolean {
  const x = enc.encode(a)
  const y = enc.encode(b)
  let diff = x.length ^ y.length
  const n = Math.max(x.length, y.length)
  for (let i = 0; i < n; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  return diff === 0
}

async function sha256(v: string): Promise<string> {
  return hex(await crypto.subtle.digest('SHA-256', enc.encode(v)))
}

export async function sessionToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(SESSION_LABEL)))
}

/** Compares digests, so timing does not depend on the password length or content. */
export async function passwordMatches(input: string, password: string): Promise<boolean> {
  return safeEqual(await sha256(input), await sha256(password))
}

export async function hasValidSession(cookie: string | undefined, password: string | undefined): Promise<boolean> {
  if (!password || !cookie) return false
  return safeEqual(cookie, await sessionToken(password))
}

/**
 * Only same-origin paths may be used as the post-login destination. Resolved against a dummy
 * origin instead of prefix checks: browsers strip tab/CR/LF, so "/\t/evil.com" would otherwise
 * pass a startsWith('//') check and be followed as "//evil.com" (open redirect).
 * Tests: node scripts/demo-auth.test.mts
 */
export function safeNext(from: string | null | undefined, fallback: string): string {
  if (!from || /[\u0000-\u001f\u007f\s\\]/.test(from)) return fallback
  try {
    const u = new URL(from, 'http://x')
    if (u.origin !== 'http://x' || u.pathname.startsWith('/login')) return fallback
    return u.pathname + u.search + u.hash
  } catch {
    return fallback
  }
}
