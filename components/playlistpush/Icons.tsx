/** Inline SVGs copied from the live page (arrow, star, check, spotify) plus static
 *  stand-ins for its three lottie animations. */

export function Arrow() {
  return (
    <span className="arrow">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function Star({ on = true, size = 17, overlay = false }: { on?: boolean; size?: number; overlay?: boolean }) {
  const cls = ['star', on ? 'is-on' : '', overlay ? 'star-overlay' : ''].filter(Boolean).join(' ')
  return (
    <svg className={cls} width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M8 .8l2.2 4.5 5 .7-3.6 3.5.9 4.9L8 12.1l-4.5 2.3.9-4.9L.8 6l5-.7z" />
    </svg>
  )
}

/** Five star slots; a fractional rating renders the site's half-star overlay. */
export function StarsRating({ rating, size = 17 }: { rating: number; size?: number }) {
  return (
    <span className="stars-rating" role="img" aria-label={`Rated ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const full = rating >= i
        const half = !full && rating > i - 1
        return (
          <span key={i} className={`star-slot${half ? ' is-half' : ''}`}>
            <Star on={full} size={size} />
            {half && <Star on size={size} overlay />}
          </span>
        )
      })}
    </span>
  )
}

export function CheckCircle() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11.003 16L18.073 8.929L16.659 7.515L11.003 13.172L8.174 10.343L6.76 11.757L11.003 16Z" fill="currentColor" />
    </svg>
  )
}

export function Tick() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---- static replacements for /assets/lottie/*.json ---- */

export function StarsLottie() {
  return (
    <div className="stars-lottie" aria-label="5 star rating">
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} on size={22} />)}
    </div>
  )
}

export function CheckLottie() {
  return (
    <span className="check-lottie">
      <CheckCircle />
    </span>
  )
}

export function SpotifyLottie() {
  return (
    <span className="spotify-lottie">
      <svg viewBox="0 0 24 24" fill="#1db954" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    </span>
  )
}
