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
    <section className="bg-brand-900 text-white">
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