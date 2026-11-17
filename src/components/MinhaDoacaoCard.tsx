import { Link } from 'react-router-dom'
import { Ban, Eye } from 'lucide-react'
import StatusBadge from './StatusBadge'
import type { DoacaoView } from '../types'
import { diasParaVencer, formatarData, formatarQuantidade, textoValidade } from '../utils/format'
import { botaoNeutro, botaoPerigo } from '../utils/styles'

interface MinhaDoacaoCardProps {
  doacao: DoacaoView
  ocupado: boolean
  onCancelar: () => void
}

export default function MinhaDoacaoCard({ doacao, ocupado, onCancelar }: MinhaDoacaoCardProps) {
  const unidade = doacao.alimento?.unidadeMedida
  const reservado = doacao.quantidadeTotal - doacao.quantidadeDisponivel
  const percentual = Math.round((doacao.quantidadeDisponivel / doacao.quantidadeTotal) * 100)
  const emAberto = doacao.status === 'DISPONIVEL' || doacao.status === 'PARCIALMENTE_RESERVADA'
  // A API só cancela doação que ainda não recebeu nenhuma reserva
  const podeCancelar = doacao.status === 'DISPONIVEL' && reservado === 0

  return (
    <article className="rounded-3xl bg-white p-5 ring-1 ring-brand-100 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg">{doacao.alimento?.nome ?? `Alimento #${doacao.idAlimento}`}</h3>
        <StatusBadge status={doacao.status} />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs font-semibold text-ink/70">
          <span>{formatarQuantidade(doacao.quantidadeDisponivel, unidade)} disponíveis</span>
          <span>de {formatarQuantidade(doacao.quantidadeTotal, unidade)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-brand-100">
          <div className="h-full rounded-full bg-linear-to-r from-brand-500 to-brand-700" style={{ width: `${percentual}%` }} />
        </div>
      </div>

      <p className="mt-3 text-xs text-ink/60">
        Validade {formatarData(doacao.dataValidade)} ({textoValidade(diasParaVencer(doacao.dataValidade)).toLowerCase()}) ·
        Retirar até {formatarData(doacao.dataLimiteRetirada)}
        {reservado > 0 && <> · Reservado por ONGs: {formatarQuantidade(reservado, unidade)}</>}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-brand-100 pt-4">
        {emAberto && (
          <Link to={`/doacoes/${doacao.idDoacao}`} className={botaoNeutro}>
            <Eye size={14} /> Ver no catálogo
          </Link>
        )}

        {emAberto && (
          <button
            type="button"
            onClick={onCancelar}
            disabled={ocupado || !podeCancelar}
            title={podeCancelar ? undefined : 'Doações que já têm reserva não podem ser canceladas.'}
            className={botaoPerigo}
          >
            <Ban size={14} /> Cancelar doação
          </button>
        )}
      </div>

      {emAberto && !podeCancelar && (
        <p className="mt-3 text-xs font-semibold text-amber-700">
          Esta doação já tem reservas, por isso não pode mais ser cancelada.
        </p>
      )}
    </article>
  )
}