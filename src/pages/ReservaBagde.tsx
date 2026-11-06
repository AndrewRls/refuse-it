import type { StatusEntrega, StatusReserva } from '../types'

const reserva: Record<StatusReserva, { label: string; classe: string }> = {
  PENDENTE: { label: 'Pendente', classe: 'bg-amber-100 text-amber-800' },
  APROVADA: { label: 'Aprovada', classe: 'bg-brand-100 text-brand-900' },
  CONCLUIDA: { label: 'Concluída', classe: 'bg-brand-700 text-white' },
  RECUSADA: { label: 'Recusada', classe: 'bg-red-100 text-red-800' },
  CANCELADA: { label: 'Cancelada', classe: 'bg-slate-200 text-slate-700' },
}

const entrega: Record<StatusEntrega, { label: string; classe: string }> = {
  AGENDADA: { label: 'Agendada', classe: 'bg-sky-100 text-sky-800' },
  EM_ANDAMENTO: { label: 'Em andamento', classe: 'bg-amber-100 text-amber-800' },
  CONCLUIDA: { label: 'Concluída', classe: 'bg-brand-700 text-white' },
  NAO_REALIZADA: { label: 'Não realizada', classe: 'bg-red-100 text-red-800' },
}

export function ReservaBadge({ status }: { status: StatusReserva }) {
  const { label, classe } = reserva[status]
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${classe}`}>{label}</span>
}

export function EntregaBadge({ status }: { status: StatusEntrega }) {
  const { label, classe } = entrega[status]
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${classe}`}>{label}</span>
}