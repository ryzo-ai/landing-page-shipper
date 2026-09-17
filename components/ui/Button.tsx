'use client'

import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'onInverse'
type ButtonSize = 'md' | 'sm'

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  type?: 'button' | 'submit' | 'reset'
  /** Open in a new tab. Off by default: CTAs should keep the visitor in the same tab. */
  newTab?: boolean
}

// Shapes and colours match glopros.ai `.button`: 50px pill, 1px same-colour border,
// Roboto 500 16px with 1.25px tracking.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-primary-fg)] hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)]',
  secondary:
    'bg-[var(--color-secondary)] border-[var(--color-secondary)] text-white hover:brightness-95',
  accent:
    'bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent-hover)] hover:border-[var(--color-accent-hover)]',
  outline:
    'bg-white/60 border-white text-[var(--color-text-primary)] hover:bg-white',
  ghost:
    'bg-transparent border-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)]/5',
  onInverse:
    'bg-[var(--color-primary-on-inverse)] border-[var(--color-primary-on-inverse)] text-white hover:brightness-110',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-10 sm:px-[3.72rem] py-[1.22rem] text-base leading-none tracking-[0.078rem]',
  sm: 'px-6 sm:px-9 py-[0.53rem] text-[0.767rem] leading-[1.15rem] tracking-[0.024rem]',
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  newTab = false,
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 border rounded-[var(--radius-full)] font-body font-medium text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2'

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
