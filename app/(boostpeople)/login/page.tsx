import type { Metadata } from 'next'
import { readMirrorMeta } from '../../../lib/mirror-pages'
import { BP_CLIENT, VACANCY_PATH, bpContent } from '../../../lib/boostpeople/content'
import { safeNext } from '../../../lib/demo-auth'
import BoostIcon from '../../../components/boostpeople/BoostIcon'
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = { title: 'Inloggen · Vacature-demo Boost & People' }

function logoPath(): string | null {
  // The mirrored logo has a content hash in its name; find it rather than hardcode it.
  const meta = readMirrorMeta(BP_CLIENT, bpContent.vacancy.slug)
  if (!meta) return null
  const dir = path.resolve(process.cwd(), 'public', 'mirror', BP_CLIENT, 'img')
  const f = fs.readdirSync(dir).find((n) => /^boost-people-logo-[a-f0-9]{8}\.svg$/.test(n))
  return f ? `/mirror/${BP_CLIENT}/img/${f}` : null
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; from?: string }> }) {
  const { error, from } = await searchParams
  const logo = logoPath()
  return (
    // role="main" on a div: B&P theme CSS restyles headings inside <main>
    <div className="bp-login" role="main">
      <div className="bp-login__card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {logo && <img className="bp-login__logo" src={logo} alt="Boost & People" width={256} height={37} />}
        <h1 className="bp-login__title">Vacature-demo</h1>
        <p className="bp-login__lead">Deze demo is beveiligd. Vul het wachtwoord in dat je hebt ontvangen.</p>
        <form method="post" action="/api/demo-login">
          <input type="hidden" name="from" value={safeNext(from, VACANCY_PATH)} />
          <label htmlFor="password">Wachtwoord</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'login-err' : undefined}
          />
          {error && (
            <p className="bp-login__err" id="login-err" role="alert">
              {error === 'config' ? 'De demo is nog niet geconfigureerd.' : 'Dat wachtwoord klopt niet. Probeer het opnieuw.'}
            </p>
          )}
          <button className="bp-btn" type="submit">
            Inloggen
            <BoostIcon />
          </button>
        </form>
      </div>
    </div>
  )
}
