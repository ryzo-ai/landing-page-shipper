import { PPFooter } from '../../types/playlistpush'
import { Arrow } from './Icons'

export default function Footer({ content }: { content: PPFooter }) {
  return (
    <footer className="footer slant">
      <div className="container">
        <div className="footer-cta reveal">
          <h2>{content.cta.title}</h2>
          <p>{content.cta.sub}</p>
          <a href={content.cta.button.href} className="btn btn-red">
            {content.cta.button.label}
            <Arrow />
          </a>
        </div>
        <div className="footer-wrapper">
          <div className="footer-brand">
            <a href={content.logo.href}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={content.logo.src} alt={content.logo.alt} width={367} height={67} loading="lazy" decoding="async" />
            </a>
            <a href={content.tagline.href} className="footer-tagline">{content.tagline.label}</a>
            <div className="footer-social">
              {content.social.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.icon} alt={s.label} width={22} height={22} loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
            <p className="footer-disclaimer">{content.disclaimer}</p>
          </div>
          <div className="footer-cols">
            {content.columns.map((col) => (
              <div className="footer-col" key={col.title}>
                <div className="col-title">{col.title}</div>
                {col.links.map((l) => <a key={l.href + l.label} href={l.href}>{l.label}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <div>{content.copyright}</div>
          <div>
            {content.bottomLinks.map((l, i) => (
              <span key={l.href}>
                {i > 0 && '  ·  '}
                <a href={l.href}>{l.label}</a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
