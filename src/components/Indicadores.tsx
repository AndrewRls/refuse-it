import type { LucideIcon } from 'lucide-react'
import CountUp from './CountUp'

export interface Kpi {
  rotulo: string
  valor: number
  casas: number
  sufixo?: string
  icon: LucideIcon
  nota?: string
}

export default function Indicadores({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.rotulo} className="rounded-3xl bg-white p-5 ring-1 ring-brand-100">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <k.icon size={22} />
          </span>
          <p className="mt-4 text-3xl font-extrabold text-brand-900">
            <CountUp valor={k.valor} casas={k.casas} />
            {k.sufixo}
          </p>
          <p className="mt-1 text-sm font-semibold text-ink/60">{k.rotulo}</p>
          {k.nota && <p className="mt-1 text-xs text-ink/50">{k.nota}</p>}
        </div>
      ))}
    </div>
  )
}