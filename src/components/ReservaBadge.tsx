const reserva: Record<string, { label: string; classe: string }> = {
  PENDENTE: { label: 'Pendente', classe: 'bg-amber-100 text-amber-800' },
  APROVADA: { label: 'Aprovada', classe: 'bg-brand-100 text-brand-900' },
  CONCLUIDA: { label: 'Concluída', classe: 'bg-brand-700 text-white' },
  RECUSADA: { label: 'Recusada', classe: 'bg-red-100 text-red-800' },
  CANCELADA: { label: 'Cancelada', classe: 'bg-slate-200 text-slate-700' },
}

export function ReservaBadge({ status }: { status: string }) {
  const { label, classe } = reserva[status] ?? {
    label: status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Reservada',
    classe: 'bg-brand-100 text-brand-900',
  }
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${classe}`}>{label}</span>
}