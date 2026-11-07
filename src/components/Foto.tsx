import { Leaf } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { foto } from '../utils/imagens'

interface FotoProps {
  nome: string
  alt: string
  icon?: LucideIcon
  className?: string
  prioritaria?: boolean
}

export default function Foto({ nome, alt, icon: Icon = Leaf, className = '', prioritaria = false }: FotoProps) {
  const src = foto(nome)

  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-linear-to-br from-brand-700 to-brand-900 ${className}`}
      >
        <Icon aria-hidden="true" className="text-white/25" size={72} strokeWidth={1.25} />
      </div>
    )
  }

  return <img src={src} alt={alt} loading={prioritaria ? 'eager' : 'lazy'} className={`object-cover ${className}`} />
}