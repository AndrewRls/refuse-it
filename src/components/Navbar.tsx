import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, Menu, UserRound, X } from 'lucide-react'
import logo from '../assets/logo.png'
import { useAuth } from '../hooks/useAuth'

const links = [
  { to: '/', label: 'Home' },
  { to: '/doacoes', label: 'Doações' },
  { to: '/painel', label: 'Painel' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/integrantes', label: 'Integrantes' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contato', label: 'Contato' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { sessao, sair } = useAuth()
  const navigate = useNavigate()

  const primeiroNome = sessao?.usuario.nome.split(' ')[0]

  function aoSair() {
    sair()
    setOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-brand-100 text-brand-900'
        : 'text-brand-700 hover:bg-brand-50 hover:text-brand-900'
    }`

  const botaoSair = (
    <button
      type="button"
      onClick={aoSair}
      className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 hover:text-brand-900"
    >
      <LogOut size={16} /> Sair
    </button>
  )

  const botaoEntrar = (
    <Link
      to="/login"
      onClick={() => setOpen(false)}
      className="flex items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-900"
    >
      <LogIn size={16} /> Entrar
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" onClick={() => setOpen(false)} aria-label="Refuse It, página inicial">
          <img src={logo} alt="Refuse It" className="h-10 w-auto" />
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <nav className="flex items-center gap-1" aria-label="Principal">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-2 flex items-center gap-1 border-l border-brand-100 pl-4">
            {sessao ? (
              <>
                <span className="flex items-center gap-2 text-sm font-bold text-brand-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <UserRound size={16} />
                  </span>
                  {primeiroNome}
                </span>
                {botaoSair}
              </>
            ) : (
              botaoEntrar
            )}
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-brand-900 hover:bg-brand-50 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        id="menu-mobile"
        className={`grid overflow-hidden transition-all duration-300 lg:hidden ${
          open ? 'grid-rows-[1fr] border-t border-brand-100' : 'grid-rows-[0fr]'
        }`}
      >
        <nav className="min-h-0 overflow-hidden" aria-label="Menu mobile">
          <div className="flex flex-col gap-1 p-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {l.label}
              </NavLink>
            ))}

            <div className="mt-3 border-t border-brand-100 pt-4">
              {sessao ? (
                <div className="flex items-center justify-between">
                  <span className="px-4 text-sm font-bold text-brand-900">Olá, {primeiroNome}</span>
                  {botaoSair}
                </div>
              ) : (
                botaoEntrar
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}