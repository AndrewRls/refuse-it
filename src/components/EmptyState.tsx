import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  titulo: string
  texto: string
  action?: ReactNode
}

export default function EmptyState({ icon: Icon, titulo, texto, action }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl bg-brand-50 p-10 text-center ring-1 ring-brand-100">
      <Icon className="mx-auto text-brand-500" size={40} />
      <h3 className="mt-4 text-lg">{titulo}</h3>
      <p className="mt-2 text-sm text-ink/70">{texto}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}