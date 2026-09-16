import { PPPitch } from '../../types/playlistpush'
import { CheckCircle } from './Icons'

export default function Pitch({ content }: { content: PPPitch }) {
  return (
    <section className="pitch slant">
      <div className="container">
        <div className="split">
          <div className="visual-first reveal">
            <div className="covers-3d">
              {content.covers.map((c) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={c.src} src={c.src} alt={c.alt} width={300} height={300} loading="lazy" decoding="async" />
              ))}
            </div>
          </div>
          <div className="copy reveal d1">
            <div className="eyebrow">{content.eyebrow}</div>
            <h2 className="section-title small">{content.title}</h2>
            <ul className="checklist">
              {content.checklist.map((item) => (
                <li key={item}><CheckCircle />{item}</li>
              ))}
            </ul>
            <a href={content.cta.href} className="btn btn-red">{content.cta.label}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
