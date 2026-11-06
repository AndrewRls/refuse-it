import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  to?: string
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-700 text-white shadow-lg shadow-brand-700/25 hover:-translate-y-0.5 hover:bg-brand-900',
  secondary:
    'bg-white text-brand-900 ring-1 ring-brand-100 hover:-translate-y-0.5 hover:bg-brand-50',
  ghost: 'text-brand-700 hover:bg-brand-50',
}

export default function Button({
  variant = 'primary',
  to,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}