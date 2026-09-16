import { PPReviews } from '../../types/playlistpush'
import { SpotifyLottie, StarsRating } from './Icons'

export default function Reviews({ content }: { content: PPReviews }) {
  return (
    <section className="reviews">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2 className="section-title">{content.title}</h2>
        </div>
        <div className="reviews-grid">
          {content.items.map((r, i) => (
            <figure key={r.name} className={`review-card reveal${i ? ` d${i}` : ''}`}>
              <StarsRating rating={5} size={14} />
              <blockquote lang="en">{r.quote}</blockquote>
              <figcaption className="review-by">
                <a className="author" href={r.artistUrl} target="_blank" rel="noopener">
                  <span className="avatar">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="photo" src={r.photo} alt={r.name} width={58} height={58} loading="lazy" />
                    <SpotifyLottie />
                  </span>
                  <span className="name">{r.name}</span>
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
