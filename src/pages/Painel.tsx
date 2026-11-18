import { useCallback, useMemo, useState } from 'react'
import { CircleCheck, Clock, Inbox, Leaf, PackageCheck, PackageOpen, Plus, X } from 'lucide-react'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Indicadores from '../components/Indicadores'
import type { Kpi } from '../components/Indicadores'
import MinhaDoacaoCard from '../components/MinhaDoacaoCard'
import MinhaReservaCard from '../components/MinhaReservaCard'
import type { ReservaExibida } from '../components/MinhaReservaCard'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import { useConta } from '../hooks/useConta'
import { useFetch } from '../hooks/useFetch'
import { doacoesApi } from '../services/doacoesApi'
import { reservasApi } from '../services/reservasApi'
import type { Conta, DoacaoView, UnidadeMedida } from '../types'
import { diasParaVencer, pesoEmKg } from '../utils/format'
import { reservaEncerrada } from '../utils/reserva'

interface Aviso {
  tipo: 'sucesso' | 'erro'
  texto: string
}

/** Soma pesos (kg) e itens por unidade, para o indicador de alimento reservado. */
function somar(itens: { quantidade: number; unidade?: UnidadeMedida }[]) {
  let kg = 0
  let unidades = 0
  for (const { quantidade, unidade } of itens) {
    if (!unidade) continue
    const peso = pesoEmKg(quantidade, unidade)
    if (peso === null) unidades += quantidade
    else kg += peso
  }
  return { kg, unidades }
}

function AvisoTela({ aviso, onFechar }: { aviso: Aviso | null; onFechar: () => void }) {
  if (!aviso) return null
  return (
    <div
      role={aviso.tipo === 'erro' ? 'alert' : 'status'}
      className={`mb-6 flex items-start justify-between gap-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
        aviso.tipo === 'erro' ? 'bg-red-50 text-red-700' : 'bg-brand-50 text-brand-900 ring-1 ring-brand-100'
      }`}
    >
      <span>{aviso.texto}</span>
      <button type="button" onClick={onFechar} aria-label="Dispensar aviso" className="shrink-0">
        <X size={16} />
      </button>
    </div>
  )
}

function Filtros<T extends string>({ opcoes, valor, onChange }: {
  opcoes: { valor: T; rotulo: string; qtd: number }[]
  valor: T
  onChange: (v: T) => void
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {opcoes.map((f) => (
        <button
          key={f.valor}
          type="button"
          aria-pressed={valor === f.valor}
          onClick={() => onChange(f.valor)}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            valor === f.valor ? 'bg-brand-700 text-white' : 'bg-white text-brand-700 ring-1 ring-brand-100 hover:bg-brand-50'
          }`}
        >
          {f.rotulo} ({f.qtd})
        </button>
      ))}
    </div>
  )
}

/* ====================== DOADOR (pessoa física ou empresa) ====================== */

type FiltroDoacao = 'TODAS' | 'ATIVAS' | 'ESGOTADAS' | 'ENCERRADAS'

const emAberto = (d: DoacaoView) =>
  (d.status === 'DISPONIVEL' || d.status === 'PARCIALMENTE_RESERVADA') && diasParaVencer(d.dataValidade) >= 0

function passaDoacao(filtro: FiltroDoacao, d: DoacaoView): boolean {
  if (filtro === 'TODAS') return true
  if (filtro === 'ATIVAS') return emAberto(d)
  if (filtro === 'ESGOTADAS') return d.status === 'ESGOTADA'
  return !emAberto(d) && d.status !== 'ESGOTADA'
}

function PainelDoador({ conta }: { conta: Conta }) {
  const buscar = useCallback(() => doacoesApi.doUsuario(conta.idUsuario), [conta.idUsuario])
  const { data, loading, error, reload, refresh } = useFetch(buscar)

  const [filtro, setFiltro] = useState<FiltroDoacao>('TODAS')
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [paraCancelar, setParaCancelar] = useState<DoacaoView | null>(null)

  const doacoes = useMemo(
    () => [...(data ?? [])].sort((a, b) => Date.parse(b.dataPublicacao) - Date.parse(a.dataPublicacao)),
    [data],
  )

  const kpis: Kpi[] = useMemo(() => {
    const reservado = somar(
      doacoes
        .filter((d) => d.status !== 'CANCELADA')
        .map((d) => ({ quantidade: d.quantidadeTotal - d.quantidadeDisponivel, unidade: d.alimento?.unidadeMedida })),
    )
    return [
      {
        rotulo: 'Alimento reservado por ONGs',
        valor: reservado.kg,
        casas: 1,
        sufixo: ' kg',
        icon: Leaf,
        nota: reservado.unidades > 0 ? `+ ${reservado.unidades.toLocaleString('pt-BR')} itens por unidade` : undefined,
      },
      { rotulo: 'Doações em aberto', valor: doacoes.filter(emAberto).length, casas: 0, icon: PackageCheck },
      { rotulo: 'Totalmente reservadas', valor: doacoes.filter((d) => d.status === 'ESGOTADA').length, casas: 0, icon: CircleCheck },
      { rotulo: 'Publicadas no total', valor: doacoes.length, casas: 0, icon: Inbox },
    ]
  }, [doacoes])

  const visiveis = doacoes.filter((d) => passaDoacao(filtro, d))

  async function cancelar() {
    if (!paraCancelar) return
    setOcupado(true)
    setAviso(null)
    try {
      await doacoesApi.cancelar(conta.idUsuario, paraCancelar.idDoacao)
      setAviso({ tipo: 'sucesso', texto: 'Doação cancelada.' })
    } catch (e) {
      setAviso({ tipo: 'erro', texto: e instanceof Error ? e.message : 'Não foi possível cancelar a doação.' })
    } finally {
      setOcupado(false)
      setParaCancelar(null)
      refresh()
    }
  }

  return (
    <>
      <PageHeader
        titulo={`Olá, ${conta.nome.split(' ')[0]}`}
        rotulo="Painel"
        descricao="Acompanhe as doações que você publicou e quanto já foi reservado."
        acao={
          <Button to="/doacoes/nova" variant="accent">
            <Plus size={18} /> Publicar doação
          </Button>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <AvisoTela aviso={aviso} onFechar={() => setAviso(null)} />

        {loading ? (
          <Spinner texto="Carregando suas doações..." />
        ) : error ? (
          <ErrorMessage mensagem={error} onRetry={reload} />
        ) : (
          <>
            <Indicadores kpis={kpis} />
            <p className="mt-3 text-xs text-ink/50">
              Peso estimado: litros e mililitros são convertidos considerando 1 L ≈ 1 kg. O indicador soma o que ONGs já
              reservaram das suas doações.
            </p>

            <div className="mt-10">
              {doacoes.length === 0 ? (
                <EmptyState
                  icon={PackageOpen}
                  titulo="Você ainda não publicou doações"
                  texto="Publique um alimento que sobrou e ajude a reduzir o desperdício."
                  action={
                    <Button to="/doacoes/nova">
                      <Plus size={18} /> Publicar doação
                    </Button>
                  }
                />
              ) : (
                <>
                  <Filtros
                    valor={filtro}
                    onChange={setFiltro}
                    opcoes={[
                      { valor: 'TODAS', rotulo: 'Todas', qtd: doacoes.length },
                      { valor: 'ATIVAS', rotulo: 'Em aberto', qtd: doacoes.filter((d) => passaDoacao('ATIVAS', d)).length },
                      { valor: 'ESGOTADAS', rotulo: 'Esgotadas', qtd: doacoes.filter((d) => passaDoacao('ESGOTADAS', d)).length },
                      { valor: 'ENCERRADAS', rotulo: 'Encerradas', qtd: doacoes.filter((d) => passaDoacao('ENCERRADAS', d)).length },
                    ]}
                  />
                  {visiveis.length === 0 ? (
                    <EmptyState icon={Inbox} titulo="Nenhuma doação nesta categoria" texto="Troque o filtro para ver as outras." />
                  ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                      {visiveis.map((d) => (
                        <MinhaDoacaoCard key={d.idDoacao} doacao={d} ocupado={ocupado} onCancelar={() => setParaCancelar(d)} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </section>

      <ConfirmDialog
        aberto={paraCancelar !== null}
        titulo="Cancelar doação?"
        rotuloConfirmar="Cancelar doação"
        perigo
        carregando={ocupado}
        onConfirmar={() => void cancelar()}
        onCancelar={() => setParaCancelar(null)}
      >
        Ela deixa de aparecer no catálogo e não poderá mais ser reservada.
      </ConfirmDialog>
    </>
  )
}

/* ====================== ONG ====================== */

type FiltroReserva = 'TODAS' | 'ATIVAS' | 'CONCLUIDAS' | 'ENCERRADAS'

function passaReserva(filtro: FiltroReserva, r: ReservaExibida): boolean {
  if (filtro === 'TODAS') return true
  if (filtro === 'CONCLUIDAS') return r.status === 'CONCLUIDA'
  if (filtro === 'ENCERRADAS') return r.status === 'CANCELADA' || r.status === 'RECUSADA'
  return !reservaEncerrada(r)
}

function PainelOng({ conta }: { conta: Conta }) {
  const buscar = useCallback(async () => {
    const [reservas, disponiveis] = await Promise.all([
      reservasApi.doUsuario(conta.idUsuario),
      // Só para enriquecer os nomes. Se falhar, o painel continua funcionando.
      doacoesApi.disponiveis().catch(() => [] as DoacaoView[]),
    ])
    return { reservas, disponiveis }
  }, [conta.idUsuario])
  const { data, loading, error, reload, refresh } = useFetch(buscar)

  const [filtro, setFiltro] = useState<FiltroReserva>('TODAS')
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [paraCancelar, setParaCancelar] = useState<ReservaExibida | null>(null)

  const reservas: ReservaExibida[] = useMemo(() => {
    if (!data) return []
    const doacaoPorId = new Map(data.disponiveis.map((d) => [d.idDoacao, d]))
    return data.reservas
      .map((r) => {
        const doacao = doacaoPorId.get(r.idDoacao)
        return {
          ...r,
          alimento: r.alimento ?? doacao?.alimento,
          nomeDoador: r.nomeDoador ?? doacao?.nomeDoador,
          retirarAte: doacao?.dataLimiteRetirada,
        }
      })
      .sort((a, b) => b.idReserva - a.idReserva)
  }, [data])

  const kpis: Kpi[] = useMemo(() => {
    const reservado = somar(
      reservas
        .filter((r) => r.status !== 'CANCELADA' && r.status !== 'RECUSADA')
        .map((r) => ({ quantidade: r.quantidadeSolicitada, unidade: r.alimento?.unidadeMedida })),
    )
    return [
      {
        rotulo: 'Alimento reservado',
        valor: reservado.kg,
        casas: 1,
        sufixo: ' kg',
        icon: Leaf,
        nota: reservado.unidades > 0 ? `+ ${reservado.unidades.toLocaleString('pt-BR')} itens por unidade` : undefined,
      },
      { rotulo: 'Reservas em andamento', valor: reservas.filter((r) => !reservaEncerrada(r)).length, casas: 0, icon: Clock },
      { rotulo: 'Reservas concluídas', valor: reservas.filter((r) => r.status === 'CONCLUIDA').length, casas: 0, icon: CircleCheck },
      { rotulo: 'Reservas no total', valor: reservas.length, casas: 0, icon: Inbox },
    ]
  }, [reservas])

  const visiveis = reservas.filter((r) => passaReserva(filtro, r))

  async function cancelar() {
    if (!paraCancelar) return
    setOcupado(true)
    setAviso(null)
    try {
      await reservasApi.cancelar(conta.idUsuario, paraCancelar.idReserva)
      setAviso({ tipo: 'sucesso', texto: 'Reserva cancelada. A quantidade voltou para a doação.' })
    } catch (e) {
      setAviso({ tipo: 'erro', texto: e instanceof Error ? e.message : 'Não foi possível cancelar a reserva.' })
    } finally {
      setOcupado(false)
      setParaCancelar(null)
      refresh()
    }
  }

  return (
    <>
      <PageHeader
        titulo={`Olá, ${conta.nome.split(' ')[0]}`}
        rotulo="Painel"
        descricao="Acompanhe as reservas da sua ONG."
        acao={
          <Button to="/doacoes" variant="accent">
            Explorar alimentos
          </Button>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <AvisoTela aviso={aviso} onFechar={() => setAviso(null)} />

        {loading ? (
          <Spinner texto="Carregando suas reservas..." />
        ) : error ? (
          <ErrorMessage mensagem={error} onRetry={reload} />
        ) : (
          <>
            <Indicadores kpis={kpis} />
            <p className="mt-3 text-xs text-ink/50">
              Peso estimado: litros e mililitros são convertidos considerando 1 L ≈ 1 kg.
            </p>

            <div className="mt-10">
              {reservas.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  titulo="Nenhuma reserva ainda"
                  texto="Encontre alimentos no catálogo e faça a primeira reserva da sua ONG."
                  action={<Button to="/doacoes">Explorar alimentos</Button>}
                />
              ) : (
                <>
                  <Filtros
                    valor={filtro}
                    onChange={setFiltro}
                    opcoes={[
                      { valor: 'TODAS', rotulo: 'Todas', qtd: reservas.length },
                      { valor: 'ATIVAS', rotulo: 'Em andamento', qtd: reservas.filter((r) => passaReserva('ATIVAS', r)).length },
                      { valor: 'CONCLUIDAS', rotulo: 'Concluídas', qtd: reservas.filter((r) => passaReserva('CONCLUIDAS', r)).length },
                      { valor: 'ENCERRADAS', rotulo: 'Canceladas', qtd: reservas.filter((r) => passaReserva('ENCERRADAS', r)).length },
                    ]}
                  />
                  {visiveis.length === 0 ? (
                    <EmptyState icon={Inbox} titulo="Nenhuma reserva nesta categoria" texto="Troque o filtro para ver as outras." />
                  ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                      {visiveis.map((r) => (
                        <MinhaReservaCard key={r.idReserva} reserva={r} ocupado={ocupado} onCancelar={() => setParaCancelar(r)} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </section>

      <ConfirmDialog
        aberto={paraCancelar !== null}
        titulo="Cancelar reserva?"
        rotuloConfirmar="Cancelar reserva"
        perigo
        carregando={ocupado}
        onConfirmar={() => void cancelar()}
        onCancelar={() => setParaCancelar(null)}
      >
        A quantidade volta a ficar disponível para outras ONGs.
      </ConfirmDialog>
    </>
  )
}

export default function Painel() {
  const conta = useConta()
  if (!conta) return null // a rota protegida já redireciona para o login
  return conta.tipo === 'ONG' ? <PainelOng conta={conta} /> : <PainelDoador conta={conta} />
}