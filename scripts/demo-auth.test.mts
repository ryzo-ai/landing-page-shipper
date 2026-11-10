// Tests for the demo gate helpers: node scripts/demo-auth.test.mts (Node 22.18+, type stripping)
import { safeNext, safeEqual, passwordMatches, hasValidSession, sessionToken } from '../lib/demo-auth.ts'

const FALLBACK = '/business-manager'
const cases: [string | null | undefined, string][] = [
  ['/\t/evil.com', FALLBACK],
  ['/\n/evil.com', FALLBACK],
  ['/\r/evil.com', FALLBACK],
  ['//evil.com', FALLBACK],
  ['/\\evil.com', FALLBACK],
  ['https://evil.com', FALLBACK],
  ['javascript:alert(1)', FALLBACK],
  ['/login?x', FALLBACK],
  ['/login', FALLBACK],
  ['', FALLBACK],
  [null, FALLBACK],
  [undefined, FALLBACK],
  ['/business-manager', '/business-manager'],
  ['/business-manager/bedankt?a=1#b', '/business-manager/bedankt?a=1#b'],
]

let failed = 0
for (const [input, want] of cases) {
  const got = safeNext(input, FALLBACK)
  const ok = got === want
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'} safeNext(${JSON.stringify(input)}) = ${JSON.stringify(got)}${ok ? '' : ` (want ${JSON.stringify(want)})`}`)
}

const check = (name: string, cond: boolean) => {
  if (!cond) failed++
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}`)
}
check('safeEqual equal', safeEqual('abc', 'abc'))
check('safeEqual different length', !safeEqual('abc', 'abcd'))
check('passwordMatches right', await passwordMatches('s3cret', 's3cret'))
check('passwordMatches wrong', !(await passwordMatches('s3cre', 's3cret')))
const token = await sessionToken('s3cret')
check('session token is not the password', !token.includes('s3cret') && token.length === 64)
check('valid session accepted', await hasValidSession(token, 's3cret'))
check('session rejected after password rotation', !(await hasValidSession(token, 'rotated')))
check('no password configured = no access', !(await hasValidSession(token, undefined)))

if (failed) {
  console.error(`${failed} failed`)
  process.exit(1)
}
console.log('all passed')
