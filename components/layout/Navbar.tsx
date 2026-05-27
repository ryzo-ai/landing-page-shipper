'use client'

import { useState, useEffect } from 'react'
import { NavbarContent } from '../../types/content'
import Button from '../ui/Button'

interface NavbarProps {
  content: NavbarContent
}

export default function Navbar({ content }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F2EDE8]/80 backdrop-blur-md border-b border-[#2D2926]/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo — links back to ryzo.nl */}
        <a
          href="https://ryzo.nl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
          aria-label="Ryzo"
        >
          {content.logo.imageSrc ? (
            <img
              src={content.logo.imageSrc}
              alt={content.logo.imageAlt ?? content.logo.text}
              className="h-8 w-auto"
            />
          ) : (
            <img
              src="/brand/asset-77.svg"
              alt="Ryzo"
              className="h-8 w-auto"
            />
          )}
        </a>

        {/* Single CTA — no nav links on landing pages */}
        <Button href={content.cta.href} variant="primary" className="px-6 py-2.5 text-sm">
          {content.cta.label}
        </Button>
      </div>
    </header>
  )
}
