import { Link } from 'react-router-dom'
import { ArrowRight, Clock, MapPin, Store } from 'lucide-react'
import StatusBadge from './StatusBadge'
import type { DoacaoView } from '../types'
import { diasParaVencer, formatarData, formatarQuantidade, textoValidade } from '../utils/format'

export default function DoacaoCard({ doacao }: { doacao: DoacaoView }) {
  const { alimento, estabelecimento } = doacao
  const dias = diasParaVencer(doacao.dataValidade)
  const percentual = Math.round((doacao.quantidadeDisponivel / doacao.quantidadeTotal) * 100)
  const urgente = dias >= 0 && dias <= 1

  return (
    <article className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-brand-100 transition duration-300 hover:ring-brand-500">
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={doacao.status} />
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${urgente ? 'text-red-600' : 'text-ink/60'}`}
        >
          <Clock size={14} /> {textoValidade(dias)}
        </span>
      </div>

      <h3 className="mt-4 text-xl">{alimento?.nome ?? `Alimento #${doacao.idAlimento}`}</h3>
      {alimento && <p className="text-xs font-semibold text-brand-700">{alimento.categoria}</p>}

      <div className="mt-3 space-y-1 text-sm text-ink/70">
        <p className="flex items-center gap-2">
          <Store size={15} className="shrink-0 text-brand-500" />
          {estabelecimento?.nomeFantasia ?? 'Estabelecimento'}
        </p>
        {estabelecimento && (
          <p className="flex items-center gap-2">
            <MapPin size={15} className="shrink-0 text-brand-500" />
            {estabelecimento.cidade}, {estabelecimento.estado}
          </p>
        )}
      </div>

      <div className="mt-5">
        <div className="mb-1 flex justify-between text-xs font-semibold text-ink/70">
          <span>{formatarQuantidade(doacao.quantidadeDisponivel, alimento?.unidadeMedida)} disponíveis</span>
          <span>de {formatarQuantidade(doacao.quantidadeTotal, alimento?.unidadeMedida)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-brand-500 to-brand-700 transition-all duration-700"
            style={{ width: `${percentual}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-ink/60">
        Retirar até {formatarData(doacao.dataLimiteRetirada)} · Validade {formatarData(doacao.dataValidade)}
      </p>

      <Link
        to={`/doacoes/${doacao.idDoacao}`}
        className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-brand-700 transition group-hover:gap-3 group-hover:text-brand-900"
      >
        Ver detalhes <ArrowRight size={16} />
      </Link>
    </article>
  )
}