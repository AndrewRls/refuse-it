import { Link } from 'react-router-dom'

const colunas = [
  {
    titulo: 'Plataforma',
    links: [
      { to: '/doacoes', label: 'Catálogo de doações' },
      { to: '/doacoes/nova', label: 'Publicar doação' },
      { to: '/painel', label: 'Painel' },
      { to: '/cadastro', label: 'Criar conta' },
    ],
  },
  {
    titulo: 'Institucional',
    links: [
      { to: '/sobre', label: 'Sobre' },
      { to: '/integrantes', label: 'Integrantes' },
      { to: '/faq', label: 'Perguntas frequentes' },
      { to: '/contato', label: 'Contato' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-24">
      <div className="h-1.5 bg-linear-to-r from-brand-500 to-brand-700" />
      <div className="bg-brand-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-2xl font-extrabold">
              REFUSE <span className="text-brand-500 italic">IT</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Diga não ao lixo. Conectamos quem tem comida sobrando a quem precisa dela.
            </p>
          </div>

          {colunas.map((c) => (
            <div key={c.titulo}>
              <p className="font-bold text-white">{c.titulo}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/75">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="transition hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-bold text-white">ODS relacionados</p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              2 · Fome zero
              <br />10 · Redução das desigualdades
              <br />11 · Cidades sustentáveis
              <br />12 · Consumo responsável
            </p>
          </div>
        </div>

        <p className="border-t border-white/10 py-5 text-center text-xs text-white/60">
          Global Solution 2026/2 · FIAP · Projeto acadêmico
        </p>
      </div>
    </footer>
  )
}