'use client'

import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:bg-[var(--color-primary-hover)] shadow-[0_10px_24px_-10px_rgba(232,81,84,0.6)] rounded-[var(--radius-full)]',
  secondary:
    'border border-[var(--color-border-hover)] text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)]/40 rounded-[var(--radius-md)]',
  ghost:
    'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)]/5 rounded-[var(--radius-md)]',
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 px-6 py-[14px] text-base font-body font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2'

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
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
