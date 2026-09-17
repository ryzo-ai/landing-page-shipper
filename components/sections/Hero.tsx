'use client'

import { motion } from 'framer-motion'
import { HeroContent } from '../../types/content'
import Button from '../ui/Button'
import Check from '../ui/Check'

function CenteredHero({ content }: { content: HeroContent }) {
  return (
    <section className="px-0">
      <div
        className="relative rounded-b-[50px] pt-[clamp(7.5rem,13vw,11.8rem)] pb-[clamp(3.5rem,6vw,4.5rem)] px-[var(--container-padding-x)]"
        style={{ backgroundImage: 'var(--gradient-hero)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 mx-auto max-w-[56rem] text-center"
        >
          <h1 className="gp-h1 mb-6">{content.headline}</h1>
          <p className="gp-lead mx-auto max-w-[40rem] mb-10">{content.subheadline}</p>

          <Button href={content.cta.href} variant="primary">
            {content.cta.label}
          </Button>

          {content.microcopy && content.microcopy.length > 0 && (
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {content.microcopy.map((item) => (
                <li key={item} className="flex items-center gap-2 font-body text-[0.9375rem] text-[var(--color-text-primary)]">
                  <Check className="text-[var(--color-secondary)]" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {content.socialProof && (
            <p className="mt-10 font-body text-sm tracking-[0.02rem] text-[var(--color-text-body)]">
              {content.socialProof}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default function Hero({ content }: { content: HeroContent }) {
  if (content.layout === 'centered') return <CenteredHero content={content} />

  const hasMedia = !!(content.backgroundVideo || content.backgroundImage)
  const overlayOpacity =
    content.backgroundVideo?.overlayOpacity ??
    content.backgroundImage?.overlayOpacity ??
    0

  return (
    <section className="relative flex flex-col items-start justify-center min-h-screen text-left px-[clamp(24px,6vw,96px)] pt-24 pb-16 bg-[var(--color-background)] overflow-hidden">
      {content.backgroundVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src={content.backgroundVideo.src}
          poster={content.backgroundVideo.poster}
          autoPlay muted loop playsInline aria-hidden="true"
        />
      )}

      {!content.backgroundVideo && content.backgroundImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          role="img"
          aria-label={content.backgroundImage.alt}
          style={{
            backgroundImage: `url(${content.backgroundImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {hasMedia && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--color-text-primary) 55%, transparent) 0%, color-mix(in srgb, var(--color-text-primary) 20%, transparent) 50%, transparent 75%)' }}
        />
      )}

      {hasMedia && overlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: `color-mix(in srgb, var(--color-text-primary) ${overlayOpacity * 100}%, transparent)` }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl"
      >
        <h1
          className={`font-heading font-bold text-[clamp(42px,7.5vw,92px)] leading-[1.02] tracking-tight mb-6 ${
            hasMedia ? 'text-[var(--color-background)]' : 'text-[var(--color-text-primary)]'
          }`}
        >
          {content.headline}
        </h1>

        <p
          className={`font-body text-lg sm:text-xl max-w-lg mb-8 leading-relaxed ${
            hasMedia ? 'text-[var(--color-background)]/80' : 'text-[var(--color-text-secondary)]'
          }`}
        >
          {content.subheadline}
        </p>

        <div className="mb-8">
          <Button href={content.cta.href} variant="primary">
            {content.cta.label}
          </Button>
        </div>

        {content.socialProof && (
          <p className={`font-body text-sm ${hasMedia ? 'text-[var(--color-background)]/55' : 'text-[var(--color-text-muted)]'}`}>
            {content.socialProof}
          </p>
        )}
      </motion.div>
    </section>
  )
}
