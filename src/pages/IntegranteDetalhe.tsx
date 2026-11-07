import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CircleCheck, UserX } from 'lucide-react'
import Avatar from '../components/Avatar'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import LinksSociais from '../components/LinksSociais'
import { integrantes } from '../data/integrantes'

export default function IntegranteDetalhe() {
  const { rm } = useParams()
  const indice = integrantes.findIndex((i) => i.rm === rm)

  if (indice === -1) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <EmptyState
          icon={UserX}
          titulo="Integrante não encontrado"
          texto="Confira o endereço ou volte para a lista da equipe."
          action={<Button to="/integrantes">Ver equipe</Button>}
        />
      </section>
    )
  }

  const pessoa = integrantes[indice]
  const anterior = integrantes[(indice - 1 + integrantes.length) % integrantes.length]
  const proximo = integrantes[(indice + 1) % integrantes.length]

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/integrantes" className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition hover:text-brand-900">
        <ArrowLeft size={16} /> Voltar para a equipe
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        <aside className="flex h-fit flex-col items-center rounded-3xl bg-brand-50 p-8 text-center ring-1 ring-brand-100">
          <Avatar nome={pessoa.nome} rm={pessoa.rm} className="h-40 w-40 text-5xl" />
          <h1 className="mt-5 text-2xl">{pessoa.nome}</h1>
          <p className="mt-1 text-sm font-bold text-brand-700">{pessoa.funcao}</p>
          <p className="mt-3 text-xs font-semibold text-ink/60">
            {pessoa.rm} · Turma {pessoa.turma}
          </p>
          <LinksSociais nome={pessoa.nomeCurto} github={pessoa.github} linkedin={pessoa.linkedin} className="mt-6 justify-center" />
        </aside>

        <div className="md:col-span-2">
          <h2 className="text-xl">Sobre a atuação</h2>
          <p className="mt-3 leading-relaxed text-ink/70">{pessoa.resumo}</p>

          {pessoa.responsabilidades && (
            <>
              <h2 className="mt-8 text-xl">Responsabilidades no projeto</h2>
              <ul className="mt-4 space-y-3">
                {pessoa.responsabilidades.map((r) => (
                  <li key={r} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <CircleCheck size={20} className="mt-0.5 shrink-0 text-brand-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <nav aria-label="Outros integrantes" className="mt-12 flex flex-col justify-between gap-3 border-t border-brand-100 pt-6 sm:flex-row">
        <Link to={`/integrantes/${anterior.rm}`} className="flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">
          <ArrowLeft size={16} /> {anterior.nomeCurto}
        </Link>
        <Link to={`/integrantes/${proximo.rm}`} className="flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900 sm:justify-end">
          {proximo.nomeCurto} <ArrowRight size={16} />
        </Link>
      </nav>
    </section>
  )
}