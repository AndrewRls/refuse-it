import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock, ExternalLink, MapPin, SearchX, Store, Thermometer, Truck } from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import ReservaCard from '../components/ReservaCard'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { useFetch } from '../hooks/useFetch'
import { carregarDetalhe } from '../services/catalogoService'
import { diasParaVencer, formatarData, formatarDataHora, formatarQuantidade, textoValidade } from '../utils/format'

function NaoEncontrada() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <EmptyState
        icon={SearchX}
        titulo="Doação não encontrada"
        texto="Ela pode ter sido removida ou o endereço está incorreto."
        action={<Button to="/doacoes">Voltar ao catálogo</Button>}
      />
    </section>
  )
}

function Conteudo({ id }: { id: number }) {
  const buscar = useCallback(() => carregarDetalhe(id), [id])
  const { data: doacao, loading, error, status, reload, refresh } = useFetch(buscar)

  if (loading) return <Spinner texto="Carregando doação..." />

  if (error || !doacao) {
    if (status === 404) return <NaoEncontrada />
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <ErrorMessage mensagem={error ?? 'Erro inesperado.'} onRetry={reload} />
      </section>
    )
  }

  const { alimento, estabelecimento } = doacao
  const dias = diasParaVencer(doacao.dataValidade)
  const urgente = dias >= 0 && dias <= 1
  const percentual = Math.round((doacao.quantidadeDisponivel / doacao.quantidadeTotal) * 100)

  const detalhes = [
    { icon: CalendarDays, rotulo: 'Validade', valor: formatarData(doacao.dataValidade), extra: textoValidade(dias), alerta: urgente },
    { icon: Truck, rotulo: 'Retirar até', valor: formatarData(doacao.dataLimiteRetirada) },
    { icon: Thermometer, rotulo: 'Armazenamento', valor: doacao.condicaoArmazenamento ?? 'Não informado' },
    { icon: Clock, rotulo: 'Publicada em', valor: formatarDataHora(doacao.dataPublicacao) },
  ]

  const enderecoCompleto = estabelecimento
    ? `${estabelecimento.endereco}, ${estabelecimento.cidade} - ${estabelecimento.estado}`
    : ''

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/doacoes"
        className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition hover:text-brand-900"
      >
        <ArrowLeft size={16} /> Voltar ao catálogo
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Cabeçalho */}
          <article className="rounded-3xl bg-white p-6 ring-1 ring-brand-100 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusBadge status={doacao.status} />
              <span className={`flex items-center gap-1.5 text-sm font-semibold ${urgente ? 'text-red-600' : 'text-ink/60'}`}>
                <Clock size={16} /> {textoValidade(dias)}
              </span>
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl">{alimento?.nome ?? `Alimento #${doacao.idAlimento}`}</h1>
            {alimento && <p className="mt-1 text-sm font-bold text-brand-700">{alimento.categoria}</p>}
            {alimento?.descricao && <p className="mt-4 leading-relaxed text-ink/70">{alimento.descricao}</p>}

            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm font-semibold text-ink/70">
                <span>{formatarQuantidade(doacao.quantidadeDisponivel, alimento?.unidadeMedida)} disponíveis</span>
                <span>de {formatarQuantidade(doacao.quantidadeTotal, alimento?.unidadeMedida)}</span>
              </div>
              <div
                className="h-3 overflow-hidden rounded-full bg-brand-100"
                role="progressbar"
                aria-valuenow={percentual}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Quantidade ainda disponível"
              >
                <div
                  className="h-full rounded-full bg-linear-to-r from-brand-500 to-brand-700 transition-all duration-700"
                  style={{ width: `${percentual}%` }}
                />
              </div>
            </div>
          </article>

          {/* Informações */}
          <div className="grid gap-4 sm:grid-cols-2">
            {detalhes.map((d) => (
              <div key={d.rotulo} className="flex gap-4 rounded-3xl bg-brand-50 p-5 ring-1 ring-brand-100">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700">
                  <d.icon size={22} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold tracking-wide text-brand-700 uppercase">{d.rotulo}</p>
                  <p className="mt-0.5 font-semibold break-words text-brand-900">{d.valor}</p>
                  {d.extra && (
                    <p className={`text-xs font-semibold ${d.alerta ? 'text-red-600' : 'text-ink/60'}`}>{d.extra}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Estabelecimento */}
          {estabelecimento && (
            <article className="rounded-3xl bg-white p-6 ring-1 ring-brand-100 sm:p-8">
              <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-brand-700 uppercase">
                <Store size={14} /> Quem está doando
              </p>
              <h2 className="mt-2 text-xl">{estabelecimento.nomeFantasia}</h2>
              <p className="text-sm text-ink/60">
                {estabelecimento.categoria.charAt(0) + estabelecimento.categoria.slice(1).toLowerCase()}
              </p>

              <p className="mt-4 flex items-start gap-2 text-sm text-ink/70">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-500" />
                {enderecoCompleto}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition hover:text-brand-900"
              >
                Ver no mapa <ExternalLink size={14} />
              </a>
            </article>
          )}
        </div>

        <ReservaCard doacao={doacao} aoAtualizar={refresh} />
      </div>
    </section>
  )
}

export default function DoacaoDetalhe() {
  const { id } = useParams()
  const numero = Number(id)

  if (!id || !Number.isInteger(numero) || numero <= 0) return <NaoEncontrada />

  // O key recria o componente ao trocar de doação, evitando mostrar dados antigos
  return <Conteudo key={numero} id={numero} />
}