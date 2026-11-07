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
}

export default function Avatar({ nome, rm, className = 'h-16 w-16 text-xl' }: AvatarProps) {
  const src = fotoIntegrante(rm)

  if (src) {
    return (
      <img
        src={src}
        alt={`Foto de ${nome}`}
        className={`shrink-0 rounded-full object-cover object-top ring-4 ring-brand-100 ${className}`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-900 font-extrabold text-white ring-4 ring-brand-100 ${className}`}
    >
      {iniciais(nome)}
    </span>
  )
}