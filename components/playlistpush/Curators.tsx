import { PPCurators } from '../../types/playlistpush'
import { CheckLottie, StarsLottie } from './Icons'

const A = '/brand/playlistpush'

export default function Curators({ content }: { content: PPCurators }) {
  const { curator } = content
  return (
    <section className="curators-light slant slant-padding-bottom">
      <div className="container">
        <div className="split">
          <div className="copy reveal">
            <h2 className="section-title small">{content.title}</h2>
            <p className="sub">{content.sub}</p>
            <a href={content.cta.href} className="btn btn-black">{content.cta.label}</a>
          </div>
          <div className="reveal d1">
            <div className="curator-stack">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ghost g2" src={`${A}/curator-card-white.webp`} alt="" aria-hidden="true" width={924} height={956} loading="lazy" decoding="async" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ghost g1" src={`${A}/curator-card-white.webp`} alt="" aria-hidden="true" width={924} height={956} loading="lazy" decoding="async" />
              <div className="curator-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${A}/curator-card-white.webp`} alt="" width={924} height={956} loading="lazy" decoding="async" />
                <div className="curator-top">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="avatar" src={curator.avatar.src} alt={curator.avatar.alt} width={130} height={130} loading="lazy" decoding="async" />
                  <div className="curator-id">
                    <div className="row">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${A}/icons/spotify-round-black.svg`} alt="" width={30} height={30} loading="lazy" decoding="async" />
                      <span className="tag">{curator.tag}</span>
                    </div>
                    <div className="name">{curator.name}</div>
                    <StarsLottie />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="tooltip" src={`${A}/tooltip.png`} alt="" width={322} height={128} loading="lazy" decoding="async" />
                  </div>
                </div>
                <div className="curator-checks">
                  {curator.checks.map((c) => (
                    <div className="check-row" key={c}><CheckLottie />{c}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
