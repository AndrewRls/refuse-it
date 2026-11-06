import { Link } from 'react-router-dom'
import { Ban, Eye, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'
import type { DoacaoView } from '../types'
import { diasParaVencer, formatarData, formatarQuantidade, textoValidade } from '../utils/format'
import { botaoNeutro, botaoPerigo } from '../utils/styles'

interface DoacaoLinhaProps {
  doacao: DoacaoView
  reservasAtivas: number
  totalReservas: number
  podeGerir: boolean
  ocupado: boolean
  mostrarEstabelecimento?: boolean
  onCancelar: () => void
  onExcluir: () => void
}

export default function DoacaoLinha({
  doacao, reservasAtivas, totalReservas, podeGerir, ocupado, mostrarEstabelecimento = false, onCancelar, onExcluir,
}: DoacaoLinhaProps) {
  const { alimento, estabelecimento } = doacao
  const unidade = alimento?.unidadeMedida
  const percentual = Math.round((doacao.quantidadeDisponivel / doacao.quantidadeTotal) * 100)
  const ativa = doacao.status === 'DISPONIVEL' || doacao.status === 'PARCIALMENTE_RESERVADA'

  return (
    <article className="rounded-3xl bg-white p-5 ring-1 ring-brand-100 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg">{alimento?.nome ?? `Alimento #${doacao.idAlimento}`}</h3>
          {mostrarEstabelecimento && estabelecimento && (
            <p className="text-sm text-ink/60">{estabelecimento.nomeFantasia}</p>
          )}
        </div>
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
        Retirar até {formatarData(doacao.dataLimiteRetirada)} · {totalReservas}{' '}
        {totalReservas === 1 ? 'reserva' : 'reservas'}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-brand-100 pt-4">
        <Link to={`/doacoes/${doacao.idDoacao}`} className={botaoNeutro}>
          <Eye size={14} /> Ver detalhes
        </Link>

        {podeGerir && ativa && (
          <button
            type="button"
            onClick={onCancelar}
            disabled={ocupado || reservasAtivas > 0}
            title={reservasAtivas > 0 ? 'Resolva as reservas pendentes ou aprovadas antes de cancelar.' : undefined}
            className={botaoPerigo}
          >
            <Ban size={14} /> Cancelar doação
          </button>
        )}

        {podeGerir && totalReservas === 0 && (
          <button type="button" onClick={onExcluir} disabled={ocupado} className={botaoPerigo}>
            <Trash2 size={14} /> Excluir
          </button>
        )}
      </div>

      {podeGerir && ativa && reservasAtivas > 0 && (
        <p className="mt-3 text-xs font-semibold text-amber-700">
          Há {reservasAtivas} {reservasAtivas === 1 ? 'reserva ativa' : 'reservas ativas'}. Resolva-as antes de cancelar.
        </p>
      )}
    </article>
  )
}