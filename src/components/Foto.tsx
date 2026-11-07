import { Leaf } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { foto } from '../utils/imagens'

interface FotoProps {
  /** Um nome ou uma lista: usa a primeira foto que existir. */
  nome: string | string[]
  alt: string
  icon?: LucideIcon
  className?: string
  prioritaria?: boolean
}

export default function Foto({ nome, alt, icon: Icon = Leaf, className = '', prioritaria = false }: FotoProps) {
  const nomes = Array.isArray(nome) ? nome : [nome]
  const src = nomes.map((n) => foto(n)).find(Boolean)

  if (!src) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-brand-700 ${className}`}>
        <Icon aria-hidden="true" className="text-white/20" size={56} strokeWidth={1.25} />
      </div>
    )
  }

  return <img src={src} alt={alt} loading={prioritaria ? 'eager' : 'lazy'} className={`object-cover ${className}`} />
}