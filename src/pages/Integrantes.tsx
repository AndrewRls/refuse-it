import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Avatar from '../components/Avatar'
import LinksSociais from '../components/LinksSociais'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { integrantes } from '../data/integrantes'

export default function Integrantes() {
  return (
    <>
      <PageHeader
        titulo="Quem construiu o Refuse It"
        rotulo="Integrantes"
        descricao="Estudantes da FIAP que uniram front-end, back-end, banco de dados e inteligência artificial em um só projeto."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {integrantes.map((p, i) => (
            <Reveal key={p.rm} delay={(i % 3) * 80}>
              <article>
                <Avatar retrato nome={p.nome} rm={p.rm} />
                <h2 className="mt-4 text-base">{p.nome}</h2>
                <p className="text-sm font-bold text-brand-700">{p.funcao}</p>
                <p className="mt-1 text-xs font-semibold text-ink/60">
                  {p.rm} · Turma {p.turma}
                </p>
                <LinksSociais nome={p.nomeCurto} github={p.github} linkedin={p.linkedin} className="mt-3" />
                <Link
                  to={`/integrantes/${p.rm}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition hover:gap-3 hover:text-brand-900"
                >
                  Ver perfil <ArrowRight size={16} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}