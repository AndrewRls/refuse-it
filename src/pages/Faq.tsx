import { useMemo, useState } from 'react'
import { ChevronDown, Search, SearchX } from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import { categoriasFaq, perguntas } from '../data/faq'
import type { CategoriaFaq } from '../data/faq'
import { semAcento } from '../utils/format'

type Filtro = CategoriaFaq | 'Todas'

export default function Faq() {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState<Filtro>('Todas')
  const [aberta, setAberta] = useState<string | null>(null)

  const lista = useMemo(() => {
    const termo = semAcento(busca.trim())
    return perguntas
      .filter((p) => (categoria === 'Todas' ? true : p.categoria === categoria))
      .filter((p) => (termo ? semAcento(`${p.pergunta} ${p.resposta}`).includes(termo) : true))
  }, [busca, categoria])

  return (
    <>
      <section className="bg-linear-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6">
          <p className="text-xs font-bold tracking-widest text-brand-700 uppercase">Ajuda</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Perguntas frequentes</h1>
          <p className="mt-3 max-w-2xl text-ink/70">Tire suas dúvidas sobre doações, reservas e segurança alimentar.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
        <div className="relative">
          <label htmlFor="busca-faq" className="sr-only">Buscar nas perguntas</label>
          <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-brand-500" />
          <input
            id="busca-faq"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar uma dúvida"
            className="w-full rounded-2xl bg-white py-3.5 pr-4 pl-11 text-sm ring-1 ring-brand-100 transition focus:ring-2 focus:ring-brand-700 focus:outline-none"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(['Todas', ...categoriasFaq] as Filtro[]).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={categoria === c}
              onClick={() => setCategoria(c)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                categoria === c ? 'bg-brand-700 text-white' : 'bg-white text-brand-700 ring-1 ring-brand-100 hover:bg-brand-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {lista.length === 0 ? (
            <EmptyState
              icon={SearchX}
              titulo="Nenhuma pergunta encontrada"
              texto="Tente outras palavras ou fale com a gente."
              action={<Button to="/contato">Falar com a equipe</Button>}
            />
          ) : (
            lista.map((p, i) => {
              const aberto = aberta === p.pergunta
              return (
                <div key={p.pergunta} className="rounded-2xl bg-white ring-1 ring-brand-100">
                  <h2 className="text-base">
                    <button
                      type="button"
                      id={`faq-botao-${i}`}
                      aria-expanded={aberto}
                      aria-controls={`faq-painel-${i}`}
                      onClick={() => setAberta(aberto ? null : p.pergunta)}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left transition hover:bg-brand-50"
                    >
                      <span>
                        <span className="block text-xs font-bold tracking-wide text-brand-700 uppercase">{p.categoria}</span>
                        <span className="mt-1 block font-bold text-brand-900">{p.pergunta}</span>
                      </span>
                      <ChevronDown size={20} className={`shrink-0 text-brand-700 transition-transform duration-300 ${aberto ? 'rotate-180' : ''}`} />
                    </button>
                  </h2>
                  <div
                    id={`faq-painel-${i}`}
                    role="region"
                    aria-labelledby={`faq-botao-${i}`}
                    className={`grid transition-all duration-300 ${aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-ink/70">{p.resposta}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="mt-12 rounded-3xl bg-brand-50 p-8 text-center ring-1 ring-brand-100">
          <h2 className="text-xl">Não achou o que procurava?</h2>
          <p className="mt-2 text-sm text-ink/70">Escreva para a equipe do Refuse It.</p>
          <div className="mt-5 flex justify-center">
            <Button to="/contato">Entrar em contato</Button>
          </div>
        </div>
      </section>
    </>
  )
}