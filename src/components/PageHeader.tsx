import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  titulo: string
  rotulo?: string
  descricao?: string
  acao?: ReactNode
}

export default function PageHeader({ titulo, rotulo, descricao, acao }: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-900 text-white">
      <div aria-hidden="true" className="absolute -top-24 -right-16 -z-10 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-32 left-1/4 -z-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 pt-12 pb-16 sm:px-6">
        <div>
          <nav aria-label="Trilha de navegação">
            <ol className="flex items-center gap-1.5 text-xs font-semibold text-brand-100">
              <li><Link to="/" className="hover:text-white">Início</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li aria-current="page" className="text-white">{rotulo ?? titulo}</li>
            </ol>
          </nav>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-extrabold text-white sm:text-5xl">{titulo}</h1>
          {descricao && <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-100">{descricao}</p>}
        </div>
        {acao}
      </div>

      <div className="h-1.5 bg-linear-to-r from-brand-500 to-brand-700" />
    </section>
  )
}