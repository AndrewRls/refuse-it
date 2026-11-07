import { ExternalLink } from 'lucide-react'

interface LinksSociaisProps {
  nome: string
  github: string
  linkedin: string
  className?: string
}

const classe =
  'inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-900 ring-1 ring-brand-100 transition hover:bg-brand-100'

export default function LinksSociais({ nome, github, linkedin, className = '' }: LinksSociaisProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <a href={github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub de ${nome} (abre em nova aba)`} className={classe}>
        GitHub <ExternalLink size={12} />
      </a>
      <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn de ${nome} (abre em nova aba)`} className={classe}>
        LinkedIn <ExternalLink size={12} />
      </a>
    </div>
  )
}