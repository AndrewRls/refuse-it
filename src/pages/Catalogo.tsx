import { useMemo, useState } from 'react'
import { PackageOpen, Plus, RotateCcw, Search, SearchX } from 'lucide-react'
import Button from '../components/Button'
import DoacaoCard from '../components/DoacaoCard'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Reveal from '../components/Reveal'
import Spinner from '../components/Spinner'
import { useFetch } from '../hooks/useFetch'
import { carregarCatalogo } from '../services/catalogoService'
import type { DoacaoView } from '../types'
import { diasParaVencer, semAcento } from '../utils/format'

const ordenacoes = {
  validade: 'Validade mais próxima',
  recentes: 'Publicadas recentemente',
  quantidade: 'Maior quantidade',
} as const

type Ordenacao = keyof typeof ordenacoes

const campo =
  'w-full rounded-2xl border-0 bg-white px-4 py-3 text-sm ring-1 ring-brand-100 transition focus:ring-2 focus:ring-brand-700 focus:outline-none'

function estaDisponivel(d: DoacaoView): boolean {
  return (
    (d.status === 'DISPONIVEL' || d.status === 'PARCIALMENTE_RESERVADA') &&
    d.quantidadeDisponivel > 0 &&
    diasParaVencer(d.dataValidade) >= 0
  )
}

export default function Catalogo() {
  const { data, loading, error, reload } = useFetch(carregarCatalogo)

  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [cidade, setCidade] = useState('')
  const [ordem, setOrdem] = useState<Ordenacao>('validade')
  const [apenasDisponiveis, setApenasDisponiveis] = useState(true)

  const doacoes = useMemo(() => data ?? [], [data])

  const categorias = useMemo(
    () =>
      [...new Set(doacoes.map((d) => d.alimento?.categoria).filter((c): c is string => Boolean(c)))].sort(),
    [doacoes],
  )

  const cidades = useMemo(
    () =>
      [...new Set(doacoes.map((d) => d.estabelecimento?.cidade).filter((c): c is string => Boolean(c)))].sort(),
    [doacoes],
  )

  const filtradas = useMemo(() => {
    const termo = semAcento(busca.trim())

    return doacoes
      .filter((d) => (apenasDisponiveis ? estaDisponivel(d) : true))
      .filter((d) => (categoria ? d.alimento?.categoria === categoria : true))
      .filter((d) => (cidade ? d.estabelecimento?.cidade === cidade : true))
      .filter((d) => {
        if (!termo) return true
        const texto = semAcento(`${d.alimento?.nome ?? ''} ${d.estabelecimento?.nomeFantasia ?? ''}`)
        return texto.includes(termo)
      })
      .sort((a, b) => {
        if (ordem === 'validade') return diasParaVencer(a.dataValidade) - diasParaVencer(b.dataValidade)
        if (ordem === 'quantidade') return b.quantidadeDisponivel - a.quantidadeDisponivel
        return Date.parse(b.dataPublicacao) - Date.parse(a.dataPublicacao)
      })
  }, [doacoes, busca, categoria, cidade, ordem, apenasDisponiveis])

  const temFiltro = Boolean(busca || categoria || cidade || !apenasDisponiveis || ordem !== 'validade')

  function limparFiltros() {
    setBusca('')
    setCategoria('')
    setCidade('')
    setOrdem('validade')
    setApenasDisponiveis(true)
  }

  return (
    <>
      <section className="bg-linear-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6">
          <p className="text-xs font-bold tracking-widest text-brand-700 uppercase">Catálogo</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Alimentos disponíveis para doação</h1>
          <p className="mt-3 max-w-2xl text-ink/70">
            Encontre o que sua instituição precisa, perto de você, antes que a validade chegue.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        {/* Filtros */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="-mt-2 rounded-3xl bg-brand-50 p-5 ring-1 ring-brand-100"
          aria-label="Filtros do catálogo"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="busca" className="mb-1.5 block text-xs font-bold text-brand-900">Buscar</label>
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-brand-500" />
                <input
                  id="busca"
                  type="search"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Alimento ou estabelecimento"
                  className={`${campo} pl-10`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="categoria" className="mb-1.5 block text-xs font-bold text-brand-900">Categoria</label>
              <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} className={campo}>
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cidade" className="mb-1.5 block text-xs font-bold text-brand-900">Cidade</label>
              <select id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} className={campo}>
                <option value="">Todas</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ordem" className="mb-1.5 block text-xs font-bold text-brand-900">Ordenar por</label>
              <select id="ordem" value={ordem} onChange={(e) => setOrdem(e.target.value as Ordenacao)} className={campo}>
                {(Object.keys(ordenacoes) as Ordenacao[]).map((o) => (
                  <option key={o} value={o}>{ordenacoes[o]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-brand-900">
              <input
                type="checkbox"
                checked={apenasDisponiveis}
                onChange={(e) => setApenasDisponiveis(e.target.checked)}
                className="h-5 w-5 rounded accent-brand-700"
              />
              Mostrar apenas o que ainda está disponível
            </label>

            {temFiltro && (
              <button
                type="button"
                onClick={limparFiltros}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-brand-700 transition hover:bg-white"
              >
                <RotateCcw size={15} /> Limpar filtros
              </button>
            )}
          </div>
        </form>

        {/* Resultado */}
        <div className="mt-10">
          {loading && <Spinner texto="Buscando alimentos..." />}

          {!loading && error && <ErrorMessage mensagem={error} onRetry={reload} />}

          {!loading && !error && doacoes.length === 0 && (
            <EmptyState
              icon={PackageOpen}
              titulo="Ainda não há doações publicadas"
              texto="Seja o primeiro a publicar um alimento e ajude a reduzir o desperdício."
              action={
                <Button to="/doacoes/nova">
                  <Plus size={18} /> Publicar uma doação
                </Button>
              }
            />
          )}

          {!loading && !error && doacoes.length > 0 && filtradas.length === 0 && (
            <EmptyState
              icon={SearchX}
              titulo="Nenhum alimento encontrado"
              texto="Tente remover algum filtro ou buscar por outro termo."
              action={<Button variant="secondary" onClick={limparFiltros}>Limpar filtros</Button>}
            />
          )}

          {!loading && !error && filtradas.length > 0 && (
            <>
              <p className="mb-5 text-sm font-semibold text-ink/60" aria-live="polite">
                {filtradas.length} {filtradas.length === 1 ? 'doação encontrada' : 'doações encontradas'}
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtradas.map((d, i) => (
                  <Reveal key={d.idDoacao} delay={(i % 3) * 80} className="h-full">
                    <DoacaoCard doacao={d} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}