import { PPTeam } from '../../types/playlistpush'

export default function Team({ content }: { content: PPTeam }) {
  return (
    <section className="team slant">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2>{content.title}</h2>
          <p>{content.sub}</p>
        </div>
        <div className="team-avatars reveal d1">
          {content.avatars.map((src) => (
            <div key={src} className="avatar" style={{ backgroundImage: `url('${src}')` }} />
          ))}
        </div>
        <p className="team-caption reveal d2">{content.caption}</p>
      </div>
    </section>
  )
}
