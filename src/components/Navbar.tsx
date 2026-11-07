import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, UserRound, X } from 'lucide-react'
import Button from './Button'
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
  const { sessao, sair } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // O menu "pertence" à página em que foi aberto: ao navegar, fecha sozinho.
  const [abertoEm, setAbertoEm] = useState<string | null>(null)
  const aberto = abertoEm === pathname

  const naHome = pathname === '/'
  const primeiroNome = sessao?.usuario.nome.split(' ')[0]

  function aoSair() {
    sair()
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-2 text-xs font-bold tracking-wider uppercase transition ${
      isActive ? 'bg-brand-700 text-white' : 'text-brand-900 hover:bg-brand-50'
    }`

  const botaoSair = (
    <button
      type="button"
      onClick={aoSair}
      className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold tracking-wider text-brand-900 uppercase transition hover:bg-brand-50"
    >
      <LogOut size={14} /> Sair
    </button>
  )

  return (
    <header
      className={
        naHome
          ? 'fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4'
          : 'sticky top-0 z-50 border-b border-brand-100 bg-white/90 backdrop-blur'
      }
    >
      <div
        className={
          naHome
            ? 'mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full bg-white/95 px-4 py-2 shadow-lg shadow-black/10 backdrop-blur sm:px-6'
            : 'mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6'
        }
      >
        <Link to="/" aria-label="Refuse It, página inicial">
          <img src={logo} alt="Refuse It" className="h-10 w-auto" />
        </Link>

        <div className="hidden items-center gap-3 xl:flex">
          <nav className="flex items-center gap-1" aria-label="Principal">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {sessao ? (
            <div className="flex items-center gap-2 border-l border-brand-100 pl-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <UserRound size={16} />
              </span>
              <span className="text-sm font-bold text-brand-900">{primeiroNome}</span>
              {botaoSair}
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-brand-100 pl-4">
              <Link
                to="/login"
                className="px-3 py-2 text-xs font-bold tracking-wider text-brand-900 uppercase hover:text-brand-700"
              >
                Entrar
              </Link>
              <Button to="/cadastro" seta>
                Cadastre-se
              </Button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-brand-900 hover:bg-brand-50 xl:hidden"
          onClick={() => setAbertoEm(aberto ? null : pathname)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        >
          {aberto ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        id="menu-mobile"
        className={`mx-auto grid max-w-7xl overflow-hidden transition-all duration-300 xl:hidden ${
          naHome ? '' : 'px-4 sm:px-6'
        } ${aberto ? `mt-2 grid-rows-[1fr] ${naHome ? '' : 'pb-3'}` : 'grid-rows-[0fr]'}`}
      >
        <nav className="min-h-0 overflow-hidden" aria-label="Menu mobile">
          <div className="rounded-3xl bg-white p-4 shadow-xl ring-1 ring-brand-100">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                  {l.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-4 border-t border-brand-100 pt-4">
              {sessao ? (
                <div className="flex items-center justify-between">
                  <span className="px-3 text-sm font-bold text-brand-900">Olá, {primeiroNome}</span>
                  {botaoSair}
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button to="/login" variant="secondary" className="flex-1">Entrar</Button>
                  <Button to="/cadastro" className="flex-1">Cadastre-se</Button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}