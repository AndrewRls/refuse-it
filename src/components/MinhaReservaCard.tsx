import { Link } from 'react-router-dom'
import { Ban, Eye } from 'lucide-react'
import { ReservaBadge } from './ReservaBadge'
import type { MinhaReserva } from '../types'
import { formatarData, formatarDataHora, formatarQuantidade } from '../utils/format'
import { reservaEncerrada } from '../utils/reserva'
import { botaoNeutro, botaoPerigo } from '../utils/styles'

export interface ReservaExibida extends MinhaReserva {
  retirarAte?: string
}

interface MinhaReservaCardProps {
  reserva: ReservaExibida
  ocupado: boolean
  onCancelar: () => void
}

export default function MinhaReservaCard({ reserva, ocupado, onCancelar }: MinhaReservaCardProps) {
  const unidade = reserva.alimento?.unidadeMedida

  return (
    <article className="rounded-3xl bg-white p-5 ring-1 ring-brand-100 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg">
            {reserva.alimento?.nome ?? `Doação #${reserva.idDoacao}`} · {formatarQuantidade(reserva.quantidadeSolicitada, unidade)}
          </h3>
          {reserva.dataReserva && <p className="mt-1 text-xs text-ink/60">Reservada em {formatarDataHora(reserva.dataReserva)}</p>}
        </div>
        <ReservaBadge status={reserva.status} />
      </div>

      <div className="mt-3 space-y-1 text-sm text-ink/70">
        {reserva.nomeDoador && (
          <p>
            <span className="font-semibold text-brand-900">Doador:</span> {reserva.nomeDoador}
          </p>
        )}
        {reserva.retirarAte && (
          <p>
            <span className="font-semibold text-brand-900">Retirar até:</span> {formatarData(reserva.retirarAte)}
          </p>
        )}
        {reserva.observacao && (
          <p>
            <span className="font-semibold text-brand-900">Observação:</span> {reserva.observacao}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-brand-100 pt-4">
        <Link to={`/doacoes/${reserva.idDoacao}`} className={botaoNeutro}>
          <Eye size={14} /> Ver doação
        </Link>
        {!reservaEncerrada(reserva) && (
          <button type="button" onClick={onCancelar} disabled={ocupado} className={botaoPerigo}>
            <Ban size={14} /> Cancelar reserva
          </button>
        )}
      </div>
    </article>
  )
}