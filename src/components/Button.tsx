import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  to?: string
  seta?: boolean
  /** Mantém o botão em formato de pílula (usado no cabeçalho do site). */
  redondo?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-3 text-sm font-bold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white shadow-lg shadow-brand-700/25 hover:-translate-y-0.5 hover:bg-brand-900',
  accent: 'bg-brand-500 text-ink shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-white',
  secondary: 'bg-white text-brand-900 ring-1 ring-brand-100 hover:-translate-y-0.5 hover:bg-brand-50',
  ghost: 'text-brand-700 hover:bg-brand-50',
}

const circulo: Record<Variant, string> = {
  primary: 'bg-white text-brand-900',
  accent: 'bg-ink text-white',
  secondary: 'bg-brand-700 text-white',
  ghost: 'bg-brand-700 text-white',
}

export default function Button({
  variant = 'primary',
  to,
  seta = false,
  redondo = false,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const tamanho = seta ? 'py-2 pr-2 pl-6' : 'px-6 py-3'
  const forma = redondo ? 'rounded-full' : 'rounded-[20px_0_20px_0]'
  const formaChip = redondo ? 'rounded-full' : 'rounded-[10px_0_10px_0]'
  const classes = `${base} ${forma} ${tamanho} ${variants[variant]} ${className}`

  const conteudo = (
    <>
      {children}
      {seta && (
        <span className={`flex h-8 w-8 items-center justify-center ${formaChip} ${circulo[variant]}`}>
          <ArrowRight size={16} />
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes}>
        {conteudo}
      </Link>
    )
  }

  return (
    <button className={classes} {...rest}>
      {conteudo}
    </button>
  )
}