import { NextRequest, NextResponse } from 'next/server'
import { DEMO_COOKIE, hasValidSession } from './lib/demo-auth'

/**
 * 1. Demo gate: the whole site needs DEMO_PASSWORD (cookie set by /api/demo-login). Without the
 *    env var nothing gets through (fail closed). Only the login page, its POST and the client's own
 *    vendored assets (fonts, logo, CSS for the login page) are public.
 * 2. DEMO_SCOPE=<client> (set on the client's Vercel project): routes outside that client's demo
 *    return 404, so engine pages on this branch are never visible on the client's deployment.
 * 3. /admin keeps its own ADMIN_PASSWORD gate on top.
 * Every response carries X-Robots-Tag: noindex, nofollow.
 */
const PUBLIC = [/^\/login$/, /^\/api\/demo-login$/, /^\/robots\.txt$/, /^\/mirror\//, /^\/_next\//]
const SCOPES: Record<string, RegExp[]> = {
  boostpeople: [/^\/$/, /^\/business-manager(\/.*)?$/],
}

function robots(res: NextResponse) {
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (PUBLIC.some((re) => re.test(pathname))) return robots(NextResponse.next())

  const ok = await hasValidSession(request.cookies.get(DEMO_COOKIE)?.value, process.env.DEMO_PASSWORD)
  if (!ok) {
    const url = new URL('/login', request.url)
    if (pathname !== '/') url.searchParams.set('from', pathname + search)
    return robots(NextResponse.redirect(url))
  }

  const scope = process.env.DEMO_SCOPE
  if (scope) {
    const allowed = SCOPES[scope]
    if (!allowed || !allowed.some((re) => re.test(pathname))) {
      return robots(new NextResponse('Not found', { status: 404 }))
    }
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookie = request.cookies.get('admin_session')
    const password = process.env.ADMIN_PASSWORD
    if (!password || cookie?.value !== password) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return robots(NextResponse.redirect(loginUrl))
    }
  }

  return robots(NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
