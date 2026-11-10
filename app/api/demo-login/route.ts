import { NextRequest, NextResponse } from 'next/server'
import { DEMO_COOKIE, DEMO_COOKIE_MAX_AGE, passwordMatches, safeNext, sessionToken } from '../../../lib/demo-auth'

const HOME = '/business-manager'

/** Login for the demo gate. Plain form POST, works without JavaScript. */
export async function POST(req: NextRequest) {
  const password = process.env.DEMO_PASSWORD
  const data = await req.formData()
  const input = String(data.get('password') ?? '')
  const next = safeNext(String(data.get('from') ?? ''), HOME)

  if (!password || !input || !(await passwordMatches(input, password))) {
    const back = new URL('/login', req.url)
    back.searchParams.set('error', password ? '1' : 'config')
    if (next !== HOME) back.searchParams.set('from', next)
    // Slow down guessing a little
    await new Promise((r) => setTimeout(r, 600))
    return NextResponse.redirect(back, 303)
  }

  const res = NextResponse.redirect(new URL(next, req.url), 303)
  res.cookies.set(DEMO_COOKIE, await sessionToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DEMO_COOKIE_MAX_AGE,
  })
  return res
}
