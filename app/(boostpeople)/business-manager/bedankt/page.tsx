import type { Metadata } from 'next'
import { readMirrorPart } from '../../../../lib/mirror-pages'
import { BP_CLIENT, VACANCY_PATH, bpContent } from '../../../../lib/boostpeople/content'
import TrackView from '../../../../components/boostpeople/TrackView'
import BoostIcon from '../../../../components/boostpeople/BoostIcon'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: `${bpContent.thankYou.title} · ${bpContent.vacancy.title} - Boost & People`,
}

/**
 * The thank-you URL is a real route, so a page-load conversion (LinkedIn Insight, Google Ads) can be
 * defined on it later. Header, footer and Florian's card are the mirrored fragments
 * (sanitised at mirror time).
 */
export default function ThankYouPage() {
  const { thankYou, vacancy } = bpContent
  const header = readMirrorPart(BP_CLIENT, 'header')
  const footer = readMirrorPart(BP_CLIENT, 'footer')
  const card = readMirrorPart(BP_CLIENT, 'contact-card')
  return (
    <div className="bp-shell">
      <TrackView event="thank_you_view" />
      <div dangerouslySetInnerHTML={{ __html: header }} />
      {/* role="main" on a div: B&P theme CSS restyles everything inside <main> (.gramoV main h4) */}
      <div className="bp-thanks" id="bp-content" role="main">
        <section className="bp-thanks__hero" aria-labelledby="bp-thanks-title">
          <p className="bp-thanks__eyebrow">
            {vacancy.title} · {vacancy.location}
          </p>
          <h1 className="bp-thanks__title" id="bp-thanks-title">
            {thankYou.title}
          </h1>
          <p className="bp-thanks__lead">{thankYou.lead}</p>
        </section>
        <div className="bp-thanks__grid">
          <section className="bp-thanks__card" aria-labelledby="bp-next-title">
            <h2 className="bp-thanks__h" id="bp-next-title">
              Wat gebeurt er nu?
            </h2>
            <ol className="bp-thanks__steps">
              {thankYou.steps.map((s) => (
                <li key={s.title}>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="bp-thanks__back">
              <a className="bp-btn" href={VACANCY_PATH}>
                {thankYou.backLabel}
                <BoostIcon />
              </a>
            </div>
          </section>
          <aside aria-label={`Contact met ${bpContent.recruiter.name}`} dangerouslySetInnerHTML={{ __html: card }} />
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: footer }} />
    </div>
  )
}
