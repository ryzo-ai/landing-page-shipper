import { PPPress } from '../../types/playlistpush'

export default function Press({ content }: { content: PPPress }) {
  return (
    <section className="press slant">
      <div className="container">
        <div className="press-label">{content.label}</div>
        <div className="press-grid">
          {content.logos.map((l) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={l.src} className={l.invert ? 'invert' : undefined} src={l.src} alt={l.alt} loading="lazy" decoding="async" />
          ))}
        </div>
      </div>
    </section>
  )
}
