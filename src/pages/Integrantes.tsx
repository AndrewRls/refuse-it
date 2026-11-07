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
        <div className="flex flex-wrap justify-center gap-6">
          {integrantes.map((p, i) => (
            <Reveal key={p.rm} delay={(i % 3) * 80} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <article className="flex h-full flex-col items-center rounded-3xl bg-white p-6 text-center ring-1 ring-brand-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10">
                <Avatar nome={p.nome} rm={p.rm} className="h-32 w-32 text-3xl" />
                <h2 className="mt-5 text-lg">{p.nome}</h2>
                <p className="text-sm font-bold text-brand-700">{p.funcao}</p>
                <p className="mt-1 text-xs font-semibold text-ink/60">
                  {p.rm} · Turma {p.turma}
                </p>

                <LinksSociais nome={p.nomeCurto} github={p.github} linkedin={p.linkedin} className="mt-5 justify-center" />

                <Link
                  to={`/integrantes/${p.rm}`}
                  className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-brand-700 transition hover:gap-3 hover:text-brand-900"
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