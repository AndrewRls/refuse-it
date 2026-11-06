import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Avatar from '../components/Avatar'
import Reveal from '../components/Reveal'
import { integrantes } from '../data/integrantes'

export default function Integrantes() {
  return (
    <>
      <section className="bg-linear-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6">
          <p className="text-xs font-bold tracking-widest text-brand-700 uppercase">Equipe</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Quem construiu o Refuse It</h1>
          <p className="mt-3 max-w-2xl text-ink/70">
            Estudantes da FIAP que uniram front-end, back-end, banco de dados e inteligência artificial em um só projeto.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrantes.map((p, i) => (
            <Reveal key={p.rm} delay={(i % 3) * 80} className="h-full">
              <Link
                to={`/integrantes/${p.rm}`}
                className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-brand-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10"
              >
                <Avatar nome={p.nome} />
                <h2 className="mt-5 text-xl">{p.nome}</h2>
                <p className="text-sm font-bold text-brand-700">{p.funcao}</p>
                <p className="mt-2 text-xs font-semibold text-ink/60">
                  {p.rm} · Turma {p.turma}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">{p.resumo}</p>
                <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-brand-700 transition group-hover:gap-3 group-hover:text-brand-900">
                  Ver perfil <ArrowRight size={16} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}