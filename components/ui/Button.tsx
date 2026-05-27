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
    'bg-[#E0621A] text-white hover:brightness-110 outline outline-1 outline-[#d4c8bc] outline-offset-4 rounded-full',
  secondary:
    'border border-[#2D2926]/20 text-[#2D2926] hover:border-[#2D2926]/40 rounded-lg',
  ghost:
    'bg-transparent text-[#2D2926] hover:bg-[#2D2926]/5 rounded-lg',
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
    'inline-flex items-center justify-center gap-2 px-8 py-4 font-geist font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0621A] focus-visible:ring-offset-2'

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes}>
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
