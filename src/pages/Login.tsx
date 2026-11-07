import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, LoaderCircle, LogIn } from 'lucide-react'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { useAuth } from '../hooks/useAuth'
import { inputClasses } from '../utils/styles'
import Foto from '../components/Foto'

const contasTeste = [
  { rotulo: 'Doador (Padaria)', email: 'doador@refuseit.com' },
  { rotulo: 'Instituição', email: 'instituicao@refuseit.com' },
  { rotulo: 'Admin', email: 'admin@refuseit.com' },
]

export default function Login() {
  const { sessao, entrar } = useAuth()
  const location = useLocation()
  const destino = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [enviou, setEnviou] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erroApi, setErroApi] = useState<string | null>(null)

  const erros = useMemo(() => {
    const e: { email?: string; senha?: string } = {}
    if (!email.trim()) e.email = 'Informe seu e-mail.'
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Informe um e-mail válido.'
    if (!senha) e.senha = 'Informe sua senha.'
    return e
  }, [email, senha])

  if (sessao) return <Navigate to={destino} replace />

  async function enviar(ev: FormEvent) {
    ev.preventDefault()
    setEnviou(true)
    setErroApi(null)

    if (erros.email || erros.senha) {
      document.getElementById(erros.email ? 'email' : 'senha')?.focus()
      return
    }

    setEnviando(true)
    try {
      await entrar(email.trim(), senha)
    } catch (err) {
      setErroApi(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl shadow-xl shadow-brand-900/10 ring-1 ring-brand-100 lg:grid-cols-2">
        {/* Painel da marca */}
                {/* Painel da marca */}
        <div className="relative isolate hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
          <Foto nome={['login', 'foto-3']} alt="" className="absolute inset-0 -z-10 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/40 to-black/20" />

          <p className="text-2xl font-extrabold">
            REFUSE <span className="text-brand-500 italic">IT</span>
          </p>

          <div>
            <h2 className="text-3xl leading-tight text-white">Bem-vindo de volta.</h2>
            <p className="mt-3 text-white/85">
              Acompanhe suas doações, reservas e o impacto que você está gerando.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white p-6 sm:p-10">
          <h1 className="text-3xl">Entrar</h1>
          <p className="mt-2 text-sm text-ink/70">Use o e-mail e a senha cadastrados.</p>

          <form onSubmit={enviar} noValidate className="mt-8 space-y-5">
            <FormField id="email" label="E-mail" required error={enviou ? erros.email : undefined}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(enviou && erros.email)}
                aria-describedby={enviou && erros.email ? 'email-erro' : undefined}
                className={inputClasses(Boolean(enviou && erros.email))}
                placeholder="voce@exemplo.com"
              />
            </FormField>

            <FormField id="senha" label="Senha" required error={enviou ? erros.senha : undefined}>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrar ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  aria-invalid={Boolean(enviou && erros.senha)}
                  aria-describedby={enviou && erros.senha ? 'senha-erro' : undefined}
                  className={`${inputClasses(Boolean(enviou && erros.senha))} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setMostrar((v) => !v)}
                  aria-label={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-brand-700 hover:bg-brand-50"
                >
                  {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FormField>

            {erroApi && (
              <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {erroApi}
              </p>
            )}

            <Button type="submit" disabled={enviando} className="w-full">
              {enviando ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" /> Entrando...
                </>
              ) : (
                <>
                  <LogIn size={18} /> Entrar
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/70">
            Ainda não tem conta?{' '}
            <Link to="/cadastro" className="font-bold text-brand-700 hover:text-brand-900">
              Cadastre-se
            </Link>
          </p>

          {import.meta.env.DEV && (
            <div className="mt-6 rounded-2xl bg-brand-50 p-4 text-xs ring-1 ring-brand-100">
              <p className="font-bold text-brand-900">Contas de teste (aparece só em desenvolvimento)</p>
              <p className="mt-1 text-ink/60">Senha de todas: 123456</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {contasTeste.map((c) => (
                  <button
                    key={c.email}
                    type="button"
                    onClick={() => {
                      setEmail(c.email)
                      setSenha('123456')
                    }}
                    className="rounded-full bg-white px-3 py-1.5 font-semibold text-brand-700 ring-1 ring-brand-100 transition hover:bg-brand-100"
                  >
                    {c.rotulo}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}