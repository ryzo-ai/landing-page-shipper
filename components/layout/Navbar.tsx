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
          ? 'bg-[var(--color-background)]/80 backdrop-blur-md border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]'
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
          ) : content.logo.showMark === false ? (
            <span className="font-heading text-base font-semibold text-[var(--color-text-primary)]">
              {content.logo.text}
            </span>
          ) : (
            <svg
              viewBox="0 0 996.81 996.81"
              className="h-8 w-auto"
              role="img"
              aria-label="Ryzo"
            >
              <rect width="996.81" height="996.81" fill="var(--color-primary)" />
              <path
                fill="#fff"
                d="M781.07,504.21v-89.41c-108.76-.52-197.08-89.13-197.08-198.01,0-.79.05-1.57.06-2.36h-89s0-.04,0-.06h-89.43c0,.79.06,1.57.06,2.36,0,108.88-88.32,197.49-197.08,198.01v89.41c76.36-.25,145.7-30.28,197.04-79.07.02.57.04,1.13.04,1.71,0,108.88-88.32,197.49-197.08,198.01v89.41c102.73-.33,192.75-54.57,243.31-135.89v218.57h85.85v-218.51c50.56,81.32,140.58,135.56,243.31,135.89v-89.41c-108.76-.52-197.08-89.13-197.08-198.01,0-.57.03-1.14.04-1.7,51.34,48.79,120.68,78.82,197.04,79.07ZM452.71,577.02c25.01-40.71,40.15-88.12,42.12-138.92,1.96,50.8,17.09,98.21,42.09,138.92h-84.21ZM495.04,424.48s0-.04,0-.06h-88.71c52.14-49.89,85.51-119.23,88.5-196.36,2.98,77.16,36.34,146.52,88.5,196.43h-88.29Z"
              />
            </svg>
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
