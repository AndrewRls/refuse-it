import { fotoIntegrante } from '../utils/imagens'

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

interface AvatarProps {
  nome: string
  rm: string
  className?: string
  retrato?: boolean
}

export default function Avatar({ nome, rm, className = 'h-16 w-16 text-xl', retrato = false }: AvatarProps) {
  const src = fotoIntegrante(rm)
  const forma = retrato ? 'aspect-[4/5] w-full rounded-[30%_0_30%_0]' : `shrink-0 rounded-[30%_0_30%_0] ${className}`

  if (src) {
    return <img src={src} alt={`Foto de ${nome}`} className={`object-cover object-top ${forma}`} />
  }

  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center bg-brand-700 font-extrabold text-white ${forma} ${retrato ? 'text-5xl' : ''}`}
    >
      {iniciais(nome)}
    </span>
  )
}