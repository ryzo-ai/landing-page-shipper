'use client'

import { PPHeader } from '../../types/playlistpush'
import { Arrow } from './Icons'
import { useScrolled } from './hooks'

export default function Header({ content }: { content: PPHeader }) {
  const scrolled = useScrolled()
  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="site-header">
      <div className="nav-row">
        <a href={content.home} className="brand" aria-label="Playlist Push home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-on-dark" src={content.logoOnDark.src} alt={content.logoOnDark.alt} width={367} height={67} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-on-light" src={content.logoOnLight.src} alt={content.logoOnLight.alt} width={402} height={67} />
        </a>
        <div className="nav-cta">
          <a href={content.signIn.href} className="btn btn-ghost">{content.signIn.label}</a>
          <a href={content.cta.href} className="btn btn-red">
            {content.cta.label}
            <Arrow />
          </a>
        </div>
      </div>
    </header>
  )
}
