'use client'

import { PPHero, PPPromoTile } from '../../types/playlistpush'
import { Arrow, StarsRating } from './Icons'
import { useCountUp } from './hooks'

function Num({ tile, className = 'tile-num' }: { tile: PPPromoTile; className?: string }) {
  const { ref, text } = useCountUp(tile.value, tile.prefix ?? '', tile.suffix ?? '')
  return <span ref={ref} className={className}>{text}</span>
}

/* The two charts are the site's own SVG paths — decorative, aria-hidden. */
function PlaylistsChart() {
  const pts: [number, number][] = [[8, 88], [66, 74], [124, 66], [182, 54], [240, 36], [292, 20]]
  return (
    <svg className="chart" viewBox="0 0 300 110" aria-hidden="true">
      <defs>
        <linearGradient id="pdBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a7fe8" stopOpacity=".38" />
          <stop offset="1" stopColor="#4a7fe8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="chart-area" d="M8,88 L66,74 L124,66 L182,54 L240,36 L292,20 L292,110 L8,110 Z" fill="url(#pdBlue)" />
      <path className="chart-line" d="M8,88 L66,74 L124,66 L182,54 L240,36 L292,20" fill="none" stroke="#4a7fe8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
      {pts.map(([cx, cy], i) => (
        <circle key={i} className="chart-dot" cx={cx} cy={cy} r="4.5" fill="#4a7fe8" stroke="#fff" strokeWidth="2" style={{ ['--i' as string]: i }} />
      ))}
    </svg>
  )
}

function StreamsChart() {
  return (
    <svg className="chart tall" viewBox="0 0 300 110" aria-hidden="true">
      <defs>
        <linearGradient id="pdGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1db954" stopOpacity=".34" />
          <stop offset="1" stopColor="#1db954" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="chart-area" d="M8,78 C40,70 60,86 92,80 C124,74 140,52 172,56 C204,60 222,34 248,26 C270,19 284,16 292,14 L292,110 L8,110 Z" fill="url(#pdGreen)" />
      <path className="chart-line delay" d="M8,92 C40,88 58,98 90,94 C122,90 138,76 170,80 C202,84 220,64 246,54 C268,46 284,42 292,40" fill="none" stroke="#0f2240" strokeWidth="2.5" strokeLinecap="round" pathLength="1" />
      <path className="chart-line" d="M8,78 C40,70 60,86 92,80 C124,74 140,52 172,56 C204,60 222,34 248,26 C270,19 284,16 292,14" fill="none" stroke="#1db954" strokeWidth="3" strokeLinecap="round" pathLength="1" />
      <line className="chart-marker" x1="248" y1="26" x2="248" y2="110" stroke="#1db954" strokeWidth="2" />
      <circle className="chart-dot" cx="248" cy="26" r="5" fill="#1db954" stroke="#fff" strokeWidth="2" style={{ ['--i' as string]: 6 }} />
    </svg>
  )
}

function SmallTile({ tile }: { tile: PPPromoTile }) {
  return (
    <div className="promo-tile">
      <div className="tile-label">{tile.label}</div>
      <div className="tile-row">
        <Num tile={tile} />
        {tile.badge && <span className="tile-badge">{tile.badge}</span>}
      </div>
      {tile.sub && <div className="tile-sub">{tile.sub}</div>}
    </div>
  )
}

export default function PageHero({ content }: { content: PPHero }) {
  const { h1, promo, trust } = content
  return (
    <section className="page-hero">
      <div className="split">
        <div className="hero-copy">
          <h1>
            {h1.before ? `${h1.before} ` : ''}
            <span className="g">{h1.highlight}</span>
            {h1.after}
          </h1>
          <p className="sub">{content.sub}</p>
          <div className="ctas">
            <a href={content.cta.href} className="btn btn-red">{content.cta.label}</a>
            <a href={content.secondary.href} className="link-more down">
              {content.secondary.label}
              <Arrow />
            </a>
          </div>
        </div>
        <div className="promo-visual reveal">
          <div className="promo-card">
            <div className="promo-title">{promo.title}</div>
            <div className="promo-grid">
              <div className="promo-tile wide">
                <div className="tile-label">{promo.playlists.label}</div>
                <Num tile={promo.playlists} className="tile-num" />
                <div className="tile-sub">{promo.playlists.sub}</div>
                <PlaylistsChart />
              </div>
              <div className="promo-tile wide">
                <div className="tile-label">{promo.streams.label}</div>
                <div className="tile-row">
                  <Num tile={promo.streams} />
                  <span className="tile-badge up">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {' '}{promo.streams.badge}
                  </span>
                </div>
                <StreamsChart />
              </div>
              <SmallTile tile={promo.editorial} />
              <SmallTile tile={promo.algorithmic} />
              <SmallTile tile={promo.listeners} />
              <SmallTile tile={promo.followers} />
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="promo-phone" src={content.phone.src} alt={content.phone.alt} width={418} height={869} fetchPriority="high" />
        </div>
      </div>
      <div className="container center">
        <a className="hero-trust" href={trust.href}>
          <StarsRating rating={trust.rating} />
          <span className="trust-text trust-rating">
            <span className="trust-score"><strong>{trust.rating}</strong> {trust.ratingText}</span>
            <span className="trust-count">
              <span className="trust-sep" aria-hidden="true">·</span> {trust.countText}
            </span>
          </span>
          <span className="trust-avatars">
            {trust.avatars.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" width={34} height={34} />
            ))}
          </span>
        </a>
        <div className="stats-row reveal">
          {content.stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="num">{s.num}</div>
              <p className="label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
