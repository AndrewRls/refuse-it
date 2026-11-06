import type { StatusDoacao } from '../types'

const estilos: Record<StatusDoacao, { label: string; classe: string }> = {
  DISPONIVEL: { label: 'Disponível', classe: 'bg-brand-100 text-brand-900' },
  PARCIALMENTE_RESERVADA: { label: 'Parcialmente reservada', classe: 'bg-amber-100 text-amber-800' },
  ESGOTADA: { label: 'Esgotada', classe: 'bg-slate-200 text-slate-700' },
  EXPIRADA: { label: 'Expirada', classe: 'bg-red-100 text-red-800' },
  CANCELADA: { label: 'Cancelada', classe: 'bg-slate-200 text-slate-700' },
}

export default function StatusBadge({ status }: { status: StatusDoacao }) {
  const { label, classe } = estilos[status]
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${classe}`}>{label}</span>
}