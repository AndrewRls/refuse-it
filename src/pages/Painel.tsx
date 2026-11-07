import { useMemo, useState } from 'react'
import { CircleCheck, Clock, Inbox, Leaf, PackageCheck, PackageOpen, Plus, Truck, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AgendarEntregaDialog from '../components/AgendarEntregaDialog'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import CountUp from '../components/CountUp'
import DoacaoLinha from '../components/DoacaoLinha'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import PageHeader from '../components/PageHeader'
import ReservaItem from '../components/ReservaItem'
import Spinner from '../components/Spinner'
import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { doacaoService } from '../services/doacaoService'
import { entregaService } from '../services/entregaService'
import { carregarPainel } from '../services/painelService'
import { reservaService } from '../services/reservaService'
import type { DoacaoView, Indicadores, ReservaView, Sessao, StatusReserva, TipoUsuario } from '../types'
import { agoraISO } from '../utils/format'
import { calcularIndicadores, montarDoacoes, montarReservas, paraDoacao, paraReserva } from '../utils/painel'

type Aba = 'reservas' | 'doacoes'
type Filtro = 'TODAS' | 'PENDENTE' | 'APROVADA' | 'CONCLUIDA' | 'ENCERRADAS'

interface Confirmacao {
  titulo: string
  texto: string
  rotulo: string
  perigo: boolean
  acao: () => Promise<void>
  sucesso: string
}

interface Aviso {
  tipo: 'sucesso' | 'erro'
  texto: string
}

interface Kpi {
  rotulo: string
  valor: number
  casas: number
  sufixo?: string
  icon: LucideIcon
}

const filtros: { valor: Filtro; rotulo: string }[] = [
  { valor: 'TODAS', rotulo: 'Todas' },
  { valor: 'PENDENTE', rotulo: 'Pendentes' },
  { valor: 'APROVADA', rotulo: 'Aprovadas' },
  { valor: 'CONCLUIDA', rotulo: 'Concluídas' },
  { valor: 'ENCERRADAS', rotulo: 'Encerradas' },
]

const statusReserva: Record<StatusReserva, { rotulo: string; barra: string }> = {
  PENDENTE: { rotulo: 'Pendentes', barra: 'bg-amber-400' },
  APROVADA: { rotulo: 'Aprovadas', barra: 'bg-brand-500' },
  CONCLUIDA: { rotulo: 'Concluídas', barra: 'bg-brand-900' },
  RECUSADA: { rotulo: 'Recusadas', barra: 'bg-red-400' },
  CANCELADA: { rotulo: 'Canceladas', barra: 'bg-slate-400' },
}

function passaNoFiltro(filtro: Filtro, r: ReservaView): boolean {
  if (filtro === 'TODAS') return true
  if (filtro === 'ENCERRADAS') return r.status === 'RECUSADA' || r.status === 'CANCELADA'
  return r.status === filtro
}

function montarKpis(perfil: TipoUsuario, ind: Indicadores, totalReservas: number): Kpi[] {
  if (perfil === 'DOADOR') {
    return [
      { rotulo: 'Alimento reaproveitado', valor: ind.kgReaproveitados, casas: 1, sufixo: ' kg', icon: Leaf },
      { rotulo: 'Doações ativas', valor: ind.doacoesAtivas, casas: 0, icon: PackageCheck },
      { rotulo: 'Reservas pendentes', valor: ind.reservasPendentes, casas: 0, icon: Clock },
      { rotulo: 'Entregas concluídas', valor: ind.reservasConcluidas, casas: 0, icon: CircleCheck },
    ]
  }

  if (perfil === 'INSTITUICAO') {
    return [
      { rotulo: 'Alimento recebido', valor: ind.kgReaproveitados, casas: 1, sufixo: ' kg', icon: Leaf },
      { rotulo: 'Reservas pendentes', valor: ind.reservasPendentes, casas: 0, icon: Clock },
      { rotulo: 'Reservas aprovadas', valor: ind.reservasAprovadas, casas: 0, icon: Truck },
      { rotulo: 'Recebimentos concluídos', valor: ind.reservasConcluidas, casas: 0, icon: CircleCheck },
    ]
  }

  return [
    { rotulo: 'Alimento reaproveitado', valor: ind.kgReaproveitados, casas: 1, sufixo: ' kg', icon: Leaf },
    { rotulo: 'Doações ativas', valor: ind.doacoesAtivas, casas: 0, icon: PackageCheck },
    { rotulo: 'Reservas na plataforma', valor: totalReservas, casas: 0, icon: Inbox },
    { rotulo: 'Entregas concluídas', valor: ind.reservasConcluidas, casas: 0, icon: CircleCheck },
  ]
}

function PainelConteudo({ sessao }: { sessao: Sessao }) {
  const perfil = sessao.usuario.tipoUsuario
  const estabelecimento = sessao.estabelecimento
  const instituicao = sessao.instituicao
  const semPerfil = (perfil === 'DOADOR' && !estabelecimento) || (perfil === 'INSTITUICAO' && !instituicao)
  const podeGerir = perfil === 'DOADOR'

  const { data, loading, error, reload, refresh } = useFetch(carregarPainel)

  const [aba, setAba] = useState<Aba>('reservas')
  const [filtro, setFiltro] = useState<Filtro>('TODAS')
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [confirmacao, setConfirmacao] = useState<Confirmacao | null>(null)
  const [paraAgendar, setParaAgendar] = useState<ReservaView | null>(null)

  /* ---------- Dados do perfil logado ---------- */
  const { doacoes, reservas } = useMemo(() => {
    if (!data) return { doacoes: [] as DoacaoView[], reservas: [] as ReservaView[] }

    const todas = montarDoacoes(data)
    const todasReservas = montarReservas(data, todas)

    if (perfil === 'DOADOR' && estabelecimento) {
      const proprias = todas.filter((d) => d.idEstabelecimento === estabelecimento.idEstabelecimento)
      const ids = new Set(proprias.map((d) => d.idDoacao))
      return { doacoes: proprias, reservas: todasReservas.filter((r) => ids.has(r.idDoacao)) }
    }

    if (perfil === 'INSTITUICAO' && instituicao) {
      return { doacoes: [] as DoacaoView[], reservas: todasReservas.filter((r) => r.idInstituicao === instituicao.idInstituicao) }
    }

    if (perfil === 'ADMIN') return { doacoes: todas, reservas: todasReservas }

    return { doacoes: [] as DoacaoView[], reservas: [] as ReservaView[] }
  }, [data, perfil, estabelecimento, instituicao])

  const indicadores = useMemo(() => calcularIndicadores(doacoes, reservas), [doacoes, reservas])
  const kpis = montarKpis(perfil, indicadores, reservas.length)

  const reservasPorDoacao = useMemo(() => {
    const mapa = new Map<number, { ativas: number; total: number }>()
    for (const r of reservas) {
      const atual = mapa.get(r.idDoacao) ?? { ativas: 0, total: 0 }
      atual.total += 1
      if (r.status === 'PENDENTE' || r.status === 'APROVADA') atual.ativas += 1
      mapa.set(r.idDoacao, atual)
    }
    return mapa
  }, [reservas])

  const reservasVisiveis = useMemo(
    () =>
      reservas
        .filter((r) => passaNoFiltro(filtro, r))
        .sort(
          (a, b) =>
            (a.status === 'PENDENTE' ? 0 : 1) - (b.status === 'PENDENTE' ? 0 : 1) ||
            Date.parse(b.dataReserva) - Date.parse(a.dataReserva),
        ),
    [reservas, filtro],
  )

  const doacoesOrdenadas = useMemo(
    () => [...doacoes].sort((a, b) => Date.parse(b.dataPublicacao) - Date.parse(a.dataPublicacao)),
    [doacoes],
  )

  /* ---------- Ações ---------- */
  async function executar(acao: () => Promise<void>, sucesso: string) {
    setOcupado(true)
    setAviso(null)
    try {
      await acao()
      setAviso({ tipo: 'sucesso', texto: sucesso })
    } catch (e) {
      setAviso({ tipo: 'erro', texto: e instanceof Error ? e.message : 'Não foi possível concluir a ação.' })
    } finally {
      setOcupado(false)
      refresh() // sempre mostra o estado real depois da tentativa
    }
  }

  async function confirmar() {
    if (!confirmacao) return
    const atual = confirmacao
    await executar(atual.acao, atual.sucesso)
    setConfirmacao(null)
  }

  const mudarReserva = async (r: ReservaView, status: StatusReserva) => {
    await reservaService.atualizar(r.idReserva, { ...paraReserva(r), status })
  }

  const aprovar = (r: ReservaView) =>
    executar(() => mudarReserva(r, 'APROVADA'), 'Reserva aprovada. Agora é só agendar a entrega.')

  const recusar = (r: ReservaView) =>
    setConfirmacao({
      titulo: 'Recusar reserva?',
      texto: 'A quantidade volta a ficar disponível para outras instituições.',
      rotulo: 'Recusar',
      perigo: true,
      acao: () => mudarReserva(r, 'RECUSADA'),
      sucesso: 'Reserva recusada.',
    })

  const cancelarReserva = (r: ReservaView) =>
    setConfirmacao({
      titulo: 'Cancelar reserva?',
      texto: 'A quantidade volta a ficar disponível para outras instituições.',
      rotulo: 'Cancelar reserva',
      perigo: true,
      acao: () => mudarReserva(r, 'CANCELADA'),
      sucesso: 'Reserva cancelada.',
    })

  const iniciarEntrega = (r: ReservaView) => {
    const e = r.entrega
    if (!e) return Promise.resolve()
    return executar(async () => {
      await entregaService.atualizar(e.idEntrega, { ...e, status: 'EM_ANDAMENTO' })
    }, 'Entrega em andamento.')
  }

  const concluirEntrega = (r: ReservaView) => {
    const e = r.entrega
    if (!e) return Promise.resolve()
    return executar(async () => {
      const agora = agoraISO()
      // Se a retirada aconteceu antes do horário combinado, o agendamento é ajustado
      // para respeitar a regra "conclusão >= agendamento" do banco.
      const dataAgendada = e.dataAgendada > agora ? agora : e.dataAgendada
      await entregaService.atualizar(e.idEntrega, { ...e, dataAgendada, dataConclusao: agora, status: 'CONCLUIDA' })
      await mudarReserva(r, 'CONCLUIDA')
    }, 'Entrega concluída. Esse alimento foi reaproveitado!')
  }

  const entregaFalhou = (r: ReservaView) => {
    const e = r.entrega
    if (!e) return
    setConfirmacao({
      titulo: 'Marcar como não realizada?',
      texto: 'A reserva será cancelada e a quantidade volta a ficar disponível.',
      rotulo: 'Confirmar',
      perigo: true,
      acao: async () => {
        await entregaService.atualizar(e.idEntrega, { ...e, status: 'NAO_REALIZADA' })
        await mudarReserva(r, 'CANCELADA')
      },
      sucesso: 'Entrega marcada como não realizada.',
    })
  }

  const cancelarDoacao = (d: DoacaoView) =>
    setConfirmacao({
      titulo: 'Cancelar doação?',
      texto: 'Ela deixa de aparecer no catálogo e não poderá mais ser reservada.',
      rotulo: 'Cancelar doação',
      perigo: true,
      acao: async () => {
        await doacaoService.atualizar(d.idDoacao, { ...paraDoacao(d), status: 'CANCELADA' })
      },
      sucesso: 'Doação cancelada.',
    })

  const excluirDoacao = (d: DoacaoView) =>
    setConfirmacao({
      titulo: 'Excluir doação?',
      texto: 'Esta ação não pode ser desfeita.',
      rotulo: 'Excluir',
      perigo: true,
      acao: () => doacaoService.remover(d.idDoacao),
      sucesso: 'Doação excluída.',
    })

  /* ---------- Tela ---------- */
  const primeiroNome = sessao.usuario.nome.split(' ')[0]
  const subtitulo =
    perfil === 'DOADOR' ? estabelecimento?.nomeFantasia : perfil === 'INSTITUICAO' ? instituicao?.nome : 'Visão geral da plataforma'
  const pendentes = reservas.filter((r) => r.status === 'PENDENTE').length

  return (
    <>
            <PageHeader
        titulo={`Olá, ${primeiroNome}`}
        rotulo="Painel"
        descricao={subtitulo}
        acao={
          perfil === 'DOADOR' ? (
            <Button to="/doacoes/nova" variant="accent">
              <Plus size={18} /> Publicar doação
            </Button>
          ) : perfil === 'INSTITUICAO' ? (
            <Button to="/doacoes" variant="accent">
              Explorar alimentos
            </Button>
          ) : undefined
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {aviso && (
          <div
            role={aviso.tipo === 'erro' ? 'alert' : 'status'}
            className={`mb-6 flex items-start justify-between gap-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
              aviso.tipo === 'erro' ? 'bg-red-50 text-red-700' : 'bg-brand-50 text-brand-900 ring-1 ring-brand-100'
            }`}
          >
            <span>{aviso.texto}</span>
            <button type="button" onClick={() => setAviso(null)} aria-label="Dispensar aviso" className="shrink-0">
              <X size={16} />
            </button>
          </div>
        )}

        {semPerfil ? (
          <EmptyState
            icon={perfil === 'DOADOR' ? PackageOpen : Inbox}
            titulo="Complete o seu cadastro"
            texto="Sua conta ainda não está vinculada a um estabelecimento ou instituição, então não há dados para mostrar."
          />
        ) : loading ? (
          <Spinner texto="Carregando painel..." />
        ) : error || !data ? (
          <ErrorMessage mensagem={error ?? 'Erro inesperado.'} onRetry={reload} />
        ) : (
          <>
            {/* Indicadores */}
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
                  {k.sufixo === ' kg' && indicadores.unidadesReaproveitadas > 0 && (
                    <p className="mt-1 text-xs text-ink/50">
                      + {indicadores.unidadesReaproveitadas.toLocaleString('pt-BR')} itens por unidade
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink/50">
              Peso estimado: litros e mililitros são convertidos considerando 1 L ≈ 1 kg. Só entregas concluídas contam
              como alimento reaproveitado.
            </p>

            {/* Distribuição das reservas */}
            {reservas.length > 0 && (
              <div className="mt-8 rounded-3xl bg-brand-50 p-5 ring-1 ring-brand-100 sm:p-6">
                <p className="text-sm font-bold text-brand-900">Reservas por situação</p>
                <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white" role="img" aria-label="Distribuição das reservas por situação">
                  {(Object.keys(statusReserva) as StatusReserva[]).map((s) => {
                    const qtd = reservas.filter((r) => r.status === s).length
                    return qtd === 0 ? null : (
                      <div key={s} className={`${statusReserva[s].barra} transition-all duration-700`} style={{ width: `${(qtd / reservas.length) * 100}%` }} />
                    )
                  })}
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-ink/70">
                  {(Object.keys(statusReserva) as StatusReserva[]).map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${statusReserva[s].barra}`} />
                      {statusReserva[s].rotulo}: {reservas.filter((r) => r.status === s).length}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Abas */}
            {perfil !== 'INSTITUICAO' && (
              <div className="mt-10 flex">
                <div role="tablist" aria-label="Seções do painel" className="inline-flex rounded-full bg-brand-50 p-1.5 ring-1 ring-brand-100">
                  {(['reservas', 'doacoes'] as Aba[]).map((a) => (
                    <button
                      key={a}
                      role="tab"
                      type="button"
                      aria-selected={aba === a}
                      onClick={() => setAba(a)}
                      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                        aba === a ? 'bg-brand-700 text-white shadow-md' : 'text-brand-700 hover:text-brand-900'
                      }`}
                    >
                      {a === 'reservas' ? 'Reservas' : 'Doações'}
                      {a === 'reservas' && pendentes > 0 && (
                        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs text-amber-950">{pendentes}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8" role="tabpanel">
              {(perfil === 'INSTITUICAO' || aba === 'reservas') && (
                <>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {filtros.map((f) => {
                      const qtd = reservas.filter((r) => passaNoFiltro(f.valor, r)).length
                      return (
                        <button
                          key={f.valor}
                          type="button"
                          aria-pressed={filtro === f.valor}
                          onClick={() => setFiltro(f.valor)}
                          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                            filtro === f.valor ? 'bg-brand-700 text-white' : 'bg-white text-brand-700 ring-1 ring-brand-100 hover:bg-brand-50'
                          }`}
                        >
                          {f.rotulo} ({qtd})
                        </button>
                      )
                    })}
                  </div>

                  {reservasVisiveis.length === 0 ? (
                    <EmptyState
                      icon={Inbox}
                      titulo={reservas.length === 0 ? 'Nenhuma reserva ainda' : 'Nenhuma reserva nesta categoria'}
                      texto={
                        perfil === 'INSTITUICAO'
                          ? 'Encontre alimentos no catálogo e faça sua primeira reserva.'
                          : 'Quando uma instituição reservar um alimento seu, ela aparece aqui.'
                      }
                      action={perfil === 'INSTITUICAO' ? <Button to="/doacoes">Explorar alimentos</Button> : undefined}
                    />
                  ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                      {reservasVisiveis.map((r) => (
                        <ReservaItem
                          key={r.idReserva}
                          reserva={r}
                          perfil={perfil}
                          ocupado={ocupado}
                          acoes={{
                            aprovar: () => void aprovar(r),
                            recusar: () => recusar(r),
                            cancelar: () => cancelarReserva(r),
                            agendar: () => setParaAgendar(r),
                            iniciarEntrega: () => void iniciarEntrega(r),
                            concluirEntrega: () => void concluirEntrega(r),
                            entregaFalhou: () => entregaFalhou(r),
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {perfil !== 'INSTITUICAO' && aba === 'doacoes' &&
                (doacoesOrdenadas.length === 0 ? (
                  <EmptyState
                    icon={PackageOpen}
                    titulo="Nenhuma doação publicada"
                    texto="Publique um alimento que sobrou e ajude a reduzir o desperdício."
                    action={
                      perfil === 'DOADOR' ? (
                        <Button to="/doacoes/nova">
                          <Plus size={18} /> Publicar doação
                        </Button>
                      ) : undefined
                    }
                  />
                ) : (
                  <div className="grid gap-5 lg:grid-cols-2">
                    {doacoesOrdenadas.map((d) => {
                      const contagem = reservasPorDoacao.get(d.idDoacao) ?? { ativas: 0, total: 0 }
                      return (
                        <DoacaoLinha
                          key={d.idDoacao}
                          doacao={d}
                          reservasAtivas={contagem.ativas}
                          totalReservas={contagem.total}
                          podeGerir={podeGerir}
                          ocupado={ocupado}
                          mostrarEstabelecimento={perfil === 'ADMIN'}
                          onCancelar={() => cancelarDoacao(d)}
                          onExcluir={() => excluirDoacao(d)}
                        />
                      )
                    })}
                  </div>
                ))}
            </div>
          </>
        )}
      </section>

      <ConfirmDialog
        aberto={confirmacao !== null}
        titulo={confirmacao?.titulo ?? ''}
        rotuloConfirmar={confirmacao?.rotulo ?? ''}
        perigo={confirmacao?.perigo}
        carregando={ocupado}
        onConfirmar={() => void confirmar()}
        onCancelar={() => setConfirmacao(null)}
      >
        {confirmacao?.texto}
      </ConfirmDialog>

      <AgendarEntregaDialog
        reserva={paraAgendar}
        onFechar={() => setParaAgendar(null)}
        onAgendada={() => {
          setParaAgendar(null)
          setAviso({ tipo: 'sucesso', texto: 'Entrega agendada.' })
          refresh()
        }}
      />
    </>
  )
}

export default function Painel() {
  const { sessao } = useAuth()
  if (!sessao) return null // a rota protegida já redireciona para o login
  return <PainelConteudo sessao={sessao} />
}