import { Info } from 'lucide-react'
import Avatar from '../components/Avatar'
import Button from '../components/Button'
import LinksSociais from '../components/LinksSociais'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { integrantes } from '../data/integrantes'

export default function Contato() {
  return (
    <>
      <PageHeader
        titulo="Fale com a equipe"
        rotulo="Contato"
        descricao="Somos estudantes da FIAP. Chame qualquer integrante pelo LinkedIn ou veja o nosso código no GitHub."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrantes.map((p, i) => (
            <Reveal key={p.rm} delay={(i % 3) * 80} className="h-full">
              <article className="flex h-full items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-brand-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10">
                <Avatar nome={p.nome} rm={p.rm} className="h-20 w-20 text-2xl" />
                <div className="min-w-0">
                  <h2 className="text-base">{p.nome}</h2>
                  <p className="text-xs font-bold text-brand-700">{p.funcao}</p>
                  <LinksSociais nome={p.nomeCurto} github={p.github} linkedin={p.linkedin} className="mt-3" />
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal delay={160} className="h-full">
            <aside className="flex h-full flex-col justify-between gap-4 rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100">
              <div>
                <p className="flex items-center gap-2 font-bold text-brand-900">
                  <Info size={20} className="text-brand-700" /> Antes de escrever
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Sua dúvida pode já estar respondida nas perguntas frequentes.
                </p>
              </div>
              <Button to="/faq" variant="secondary" seta>
                Ver o FAQ
              </Button>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  )
}