import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-24">
      <div className="h-2 bg-linear-to-r from-brand-500 to-brand-700" />
      <div className="bg-brand-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="text-xl font-extrabold">
              REFUSE <span className="text-brand-500 italic">IT</span>
            </p>
            <p className="mt-3 text-sm text-brand-100">
              Diga não ao lixo. Conectamos quem tem comida sobrando a quem precisa dela.
            </p>
          </div>
          <div>
            <p className="font-semibold">Navegação</p>
            <ul className="mt-3 space-y-2 text-sm text-brand-100">
              <li><Link to="/doacoes" className="hover:text-white">Catálogo de doações</Link></li>
              <li><Link to="/painel" className="hover:text-white">Painel</Link></li>
              <li><Link to="/sobre" className="hover:text-white">Sobre</Link></li>
              <li><Link to="/integrantes" className="hover:text-white">Integrantes</Link></li>
              <li><Link to="/faq" className="hover:text-white">Perguntas frequentes</Link></li>
              <li><Link to="/contato" className="hover:text-white">Contato</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">ODS relacionados</p>
            <p className="mt-3 text-sm text-brand-100">
              2 · Fome zero · 10 · Redução das desigualdades · 11 · Cidades sustentáveis · 12 · Consumo responsável
            </p>
          </div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs text-brand-100">
          Global Solution 2026/2 · CitizenTech · FIAP
        </p>
      </div>
    </footer>
  )
}