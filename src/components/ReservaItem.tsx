import { Link } from 'react-router-dom'
import { Ban, Check, PackageCheck, Play, Truck, X } from 'lucide-react'
import { EntregaBadge, ReservaBadge } from './ReservaBadge'
import type { ReservaView, TipoEntrega, TipoUsuario } from '../types'
import { formatarDataHora, formatarQuantidade } from '../utils/format'
import { botaoNeutro, botaoPerigo, botaoPrimario } from '../utils/styles'

export interface AcoesReserva {
  aprovar: () => void
  recusar: () => void
  cancelar: () => void
  agendar: () => void
  iniciarEntrega: () => void
  concluirEntrega: () => void
  entregaFalhou: () => void
}

interface ReservaItemProps {
  reserva: ReservaView
  perfil: TipoUsuario
  ocupado: boolean
  acoes: AcoesReserva
}

const rotuloTipo: Record<TipoEntrega, string> = {
  RETIRADA: 'Retirada pela instituição',
  ENTREGA: 'Entrega pelo estabelecimento',
}

export default function ReservaItem({ reserva, perfil, ocupado, acoes }: ReservaItemProps) {
  const { doacao, instituicao, entrega } = reserva
  const alimento = doacao?.alimento
  const unidade = alimento?.unidadeMedida
  const estabelecimento = doacao?.estabelecimento

  const ehDoador = perfil === 'DOADOR'
  const ehInstituicao = perfil === 'INSTITUICAO'
  const aprovada = reserva.status === 'APROVADA'

  const podeCancelarInstituicao =
    ehInstituicao && (reserva.status === 'PENDENTE' || (aprovada && !entrega))

  const temAcao =
    (ehDoador && (reserva.status === 'PENDENTE' || (aprovada && (!entrega || entrega.status === 'AGENDADA' || entrega.status === 'EM_ANDAMENTO')))) ||
    podeCancelarInstituicao

  return (
    <article className="rounded-3xl bg-white p-5 ring-1 ring-brand-100 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg">
            {alimento?.nome ?? `Doação #${reserva.idDoacao}`} · {formatarQuantidade(reserva.quantidadeSolicitada, unidade)}
          </h3>
          <p className="mt-1 text-xs text-ink/60">Solicitada em {formatarDataHora(reserva.dataReserva)}</p>
        </div>
        <ReservaBadge status={reserva.status} />
      </div>

      <div className="mt-3 space-y-1 text-sm text-ink/70">
        {!ehInstituicao && instituicao && (
          <p>
            <span className="font-semibold text-brand-900">Instituição:</span> {instituicao.nome} · {instituicao.cidade}/
            {instituicao.estado}
          </p>
        )}
        {!ehDoador && estabelecimento && (
          <p>
            <span className="font-semibold text-brand-900">Estabelecimento:</span> {estabelecimento.nomeFantasia} ·{' '}
            {estabelecimento.cidade}/{estabelecimento.estado}
          </p>
        )}
        {reserva.observacao && (
          <p>
            <span className="font-semibold text-brand-900">Observação:</span> {reserva.observacao}
          </p>
        )}
      </div>

      {entrega && (
        <div className="mt-4 rounded-2xl bg-brand-50 p-4 text-sm ring-1 ring-brand-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 font-bold text-brand-900">
              <Truck size={16} /> {rotuloTipo[entrega.tipoEntrega]}
            </p>
            <EntregaBadge status={entrega.status} />
          </div>
          <p className="mt-2 text-ink/70">
            Agendada para {formatarDataHora(entrega.dataAgendada)}
            {entrega.responsavel ? ` · Responsável: ${entrega.responsavel}` : ''}
          </p>
          {entrega.dataConclusao && <p className="text-ink/70">Concluída em {formatarDataHora(entrega.dataConclusao)}</p>}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-brand-100 pt-4">
        <Link to={`/doacoes/${reserva.idDoacao}`} className={botaoNeutro}>
          Ver doação
        </Link>

        {ehDoador && reserva.status === 'PENDENTE' && (
          <>
            <button type="button" onClick={acoes.aprovar} disabled={ocupado} className={botaoPrimario}>
              <Check size={14} /> Aprovar
            </button>
            <button type="button" onClick={acoes.recusar} disabled={ocupado} className={botaoPerigo}>
              <X size={14} /> Recusar
            </button>
          </>
        )}

        {ehDoador && aprovada && !entrega && (
          <button type="button" onClick={acoes.agendar} disabled={ocupado} className={botaoPrimario}>
            <Truck size={14} /> Agendar entrega
          </button>
        )}

        {ehDoador && aprovada && entrega?.status === 'AGENDADA' && (
          <button type="button" onClick={acoes.iniciarEntrega} disabled={ocupado} className={botaoPrimario}>
            <Play size={14} /> Iniciar entrega
          </button>
        )}

        {ehDoador && aprovada && entrega?.status === 'EM_ANDAMENTO' && (
          <button type="button" onClick={acoes.concluirEntrega} disabled={ocupado} className={botaoPrimario}>
            <PackageCheck size={14} /> Concluir entrega
          </button>
        )}

        {ehDoador && aprovada && (entrega?.status === 'AGENDADA' || entrega?.status === 'EM_ANDAMENTO') && (
          <button type="button" onClick={acoes.entregaFalhou} disabled={ocupado} className={botaoPerigo}>
            <Ban size={14} /> Não realizada
          </button>
        )}

        {podeCancelarInstituicao && (
          <button type="button" onClick={acoes.cancelar} disabled={ocupado} className={botaoPerigo}>
            <Ban size={14} /> Cancelar reserva
          </button>
        )}
      </div>

      {!temAcao && reserva.status === 'APROVADA' && ehInstituicao && (
        <p className="mt-3 text-xs text-ink/60">A entrega já está em andamento e só o estabelecimento pode alterá-la.</p>
      )}
    </article>
  )
}