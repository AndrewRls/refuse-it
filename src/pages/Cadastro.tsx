import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Check, CircleCheck, Eye, EyeOff, HeartHandshake, LoaderCircle, Store, UserPlus, UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { useAuth } from '../hooks/useAuth'
import { buscarCep } from '../services/cepService'
import type { EnderecoCep } from '../services/cepService'
import { usuarioService } from '../services/usuarioService'
import type { TipoConta } from '../types'
import {
  apenasDigitos, cnpjValido, cpfValido, emailValido, erroSenha, mascararCEP, mascararCNPJ, mascararCPF, mascararTelefone,
} from '../utils/forms'
import { inputClasses } from '../utils/styles'

type Etapa = 1 | 2 | 3
type Elemento = HTMLInputElement | HTMLSelectElement

interface Valores {
  email: string
  telefone: string
  senha: string
  confirmarSenha: string
  documento: string
  categoria: string
  cep: string
  numero: string
}

type Erros = Partial<Record<keyof Valores, string>>

const inicial: Valores = {
  email: '', telefone: '', senha: '', confirmarSenha: '', documento: '', categoria: '', cep: '', numero: '',
}

const tipos: { valor: TipoConta; icon: LucideIcon; titulo: string; texto: string }[] = [
  { valor: 'PESSOA_FISICA', icon: UserRound, titulo: 'Pessoa física', texto: 'Quero doar alimentos. Preciso do CPF.' },
  { valor: 'EMPRESA', icon: Store, titulo: 'Empresa', texto: 'Restaurante, mercado, padaria ou produtor que quer doar. Preciso do CNPJ.' },
  { valor: 'ONG', icon: HeartHandshake, titulo: 'ONG', texto: 'Instituição que recebe alimentos para quem precisa. Preciso do CNPJ.' },
]

const categorias = [
  { valor: 'RESTAURANTE', rotulo: 'Restaurante' },
  { valor: 'MERCADO', rotulo: 'Mercado' },
  { valor: 'PADARIA', rotulo: 'Padaria' },
  { valor: 'PRODUTOR', rotulo: 'Produtor rural' },
  { valor: 'OUTRO', rotulo: 'Outro' },
]

const nomesEtapas = ['Tipo de conta', 'Acesso', 'Documento e endereço']

function validarAcesso(v: Valores): Erros {
  const e: Erros = {}

  if (!v.email.trim()) e.email = 'Informe seu e-mail.'
  else if (!emailValido(v.email.trim())) e.email = 'Informe um e-mail válido.'

  const n = apenasDigitos(v.telefone).length
  if (!v.telefone) e.telefone = 'Informe seu telefone.'
  else if (n < 10 || n > 11) e.telefone = 'Informe o DDD e o número (10 ou 11 dígitos).'

  const erro = erroSenha(v.senha)
  if (erro) e.senha = erro

  if (!v.confirmarSenha) e.confirmarSenha = 'Confirme a senha.'
  else if (v.confirmarSenha !== v.senha) e.confirmarSenha = 'As senhas não conferem.'

  return e
}

function validarPerfil(v: Valores, tipo: TipoConta, cepEncontrado: boolean): Erros {
  const e: Erros = {}

  if (tipo === 'PESSOA_FISICA') {
    if (!v.documento) e.documento = 'Informe o CPF.'
    else if (!cpfValido(v.documento)) e.documento = 'CPF inválido. Confira os números.'
  } else {
    if (!v.documento) e.documento = 'Informe o CNPJ.'
    else if (!cnpjValido(v.documento)) e.documento = 'CNPJ inválido. Confira os números.'
  }

  if (tipo === 'EMPRESA' && !v.categoria) e.categoria = 'Selecione a categoria.'

  if (apenasDigitos(v.cep).length !== 8) e.cep = 'Informe um CEP com 8 dígitos.'
  else if (!cepEncontrado) e.cep = 'Não encontramos esse CEP. Confira os números.'

  if (!v.numero) e.numero = 'Informe o número do endereço.'

  return e
}

export default function Cadastro() {
  const { sessao, entrar } = useAuth()

  const [etapa, setEtapa] = useState<Etapa>(1)
  const [tipo, setTipo] = useState<TipoConta | null>(null)
  const [valores, setValores] = useState<Valores>(inicial)
  const [tocados, setTocados] = useState<Partial<Record<keyof Valores, boolean>>>({})
  const [tentou, setTentou] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [enderecoCep, setEnderecoCep] = useState<EnderecoCep | null>(null)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [verificando, setVerificando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erroApi, setErroApi] = useState<string | null>(null)
  const [emailRepetido, setEmailRepetido] = useState<string | null>(null)
  const [concluido, setConcluido] = useState(false)
  const [entrouAuto, setEntrouAuto] = useState(false)

  const errosAcesso = useMemo(() => {
    const e = validarAcesso(valores)
    if (!e.email && emailRepetido && valores.email.trim().toLowerCase() === emailRepetido) {
      e.email = 'Este e-mail já está cadastrado.'
    }
    return e
  }, [valores, emailRepetido])
  const errosPerfil = useMemo(
    () => (tipo ? validarPerfil(valores, tipo, enderecoCep !== null) : {}),
    [valores, tipo, enderecoCep],
  )
  const erros = etapa === 2 ? errosAcesso : errosPerfil

  // Quem já está logado não precisa se cadastrar (exceto na tela de sucesso)
  if (sessao && !concluido) return <Navigate to="/" replace />

  function alterar(campo: keyof Valores, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }))
  }

  function erroDe(campo: keyof Valores): string | undefined {
    return tentou || tocados[campo] ? erros[campo] : undefined
  }

  function campo(id: keyof Valores) {
    const erro = erroDe(id)
    return {
      id,
      value: valores[id],
      onChange: (e: ChangeEvent<Elemento>) => alterar(id, e.target.value),
      onBlur: () => setTocados((t) => ({ ...t, [id]: true })),
      'aria-invalid': Boolean(erro),
      'aria-describedby': erro ? `${id}-erro` : undefined,
      className: inputClasses(Boolean(erro)),
    }
  }

  async function aoMudarCep(texto: string) {
    const mascarado = mascararCEP(texto)
    alterar('cep', mascarado)
    setEnderecoCep(null)

    if (apenasDigitos(mascarado).length === 8) {
      setBuscandoCep(true)
      setEnderecoCep(await buscarCep(mascarado))
      setBuscandoCep(false)
    }
  }

  async function finalizar() {
    if (!tipo) return
    setErroApi(null)
    setEnviando(true)

    try {
      await usuarioService.cadastrar({
        tipo,
        email: valores.email.trim(),
        senha: valores.senha,
        telefone: apenasDigitos(valores.telefone),
        documento: apenasDigitos(valores.documento),
        categoria: valores.categoria || undefined,
        cep: apenasDigitos(valores.cep),
        numero: apenasDigitos(valores.numero),
      })

      setConcluido(true)
      try {
        await entrar(valores.email.trim(), valores.senha, tipo)
        setEntrouAuto(true)
      } catch {
        setEntrouAuto(false) // conta criada; a pessoa entra manualmente
      }
    } catch (err) {
      setErroApi(err instanceof Error ? err.message : 'Não foi possível concluir o cadastro.')
    } finally {
      setEnviando(false)
    }
  }

  async function avancar(ev: FormEvent) {
    ev.preventDefault()

    if (etapa === 1) {
      if (tipo) setEtapa(2)
      return
    }

    setTentou(true)
    const primeiroErro = Object.keys(erros)[0]
    if (primeiroErro) {
      document.getElementById(primeiroErro)?.focus()
      return
    }

    if (etapa === 2) {
      // Confere na API se o e-mail já existe, antes de pedir o resto dos dados
      setVerificando(true)
      try {
        const existe = await usuarioService.emailExiste(valores.email.trim())
        if (existe) {
          setEmailRepetido(valores.email.trim().toLowerCase())
          document.getElementById('email')?.focus()
          return
        }
      } catch {
        /* se a checagem falhar, a API valida de novo no cadastro */
      } finally {
        setVerificando(false)
      }
      setEtapa(3)
      setTentou(false)
      return
    }

    await finalizar()
  }

  function voltar() {
    setErroApi(null)
    setTentou(false)
    setEtapa((e) => (e > 1 ? ((e - 1) as Etapa) : e))
  }

  /* ---------- Tela de sucesso ---------- */
  if (concluido) {
    return (
      <section className="px-4 py-16 sm:px-6">
        <div role="status" className="mx-auto max-w-xl rounded-3xl bg-brand-50 p-10 text-center ring-1 ring-brand-100">
          <CircleCheck className="mx-auto text-brand-700" size={56} />
          <h1 className="mt-4 text-3xl">Conta criada!</h1>
          <p className="mt-3 text-ink/70">
            {entrouAuto
              ? 'Bem-vindo(a) ao Refuse It. Você já está logado(a).'
              : 'Sua conta foi criada. Entre com seu e-mail e senha para continuar.'}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {!entrouAuto && <Button to="/login">Entrar</Button>}
            {entrouAuto && tipo !== 'ONG' && <Button to="/doacoes/nova">Publicar minha primeira doação</Button>}
            {entrouAuto && (
              <Button to="/doacoes" variant="secondary">
                Explorar o catálogo
              </Button>
            )}
          </div>
        </div>
      </section>
    )
  }

  /* ---------- Formulário em etapas ---------- */
  return (
    <section className="px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl sm:text-4xl">Criar conta</h1>
        <p className="mt-2 text-ink/70">Leva menos de dois minutos.</p>

        <ol className="mt-8 flex items-center" aria-label="Etapas do cadastro">
          {nomesEtapas.map((nome, i) => {
            const n = i + 1
            const atual = etapa === n
            const feita = etapa > n
            return (
              <li key={nome} className={`flex items-center ${n < 3 ? 'flex-1' : ''}`} aria-current={atual ? 'step' : undefined}>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                    atual || feita ? 'bg-brand-700 text-white' : 'bg-brand-100 text-brand-700'
                  }`}
                >
                  {feita ? <Check size={18} /> : n}
                </span>
                <span className={`ml-2 hidden text-sm font-bold sm:inline ${atual ? 'text-brand-900' : 'text-ink/50'}`}>
                  {nome}
                </span>
                {n < 3 && <span className={`mx-3 h-0.5 flex-1 rounded ${feita ? 'bg-brand-700' : 'bg-brand-100'}`} />}
              </li>
            )
          })}
        </ol>

        <form onSubmit={(ev) => void avancar(ev)} noValidate className="mt-8 space-y-6 rounded-3xl bg-white p-6 ring-1 ring-brand-100 sm:p-8">
          {/* ETAPA 1 */}
          {etapa === 1 && (
            <>
              <div>
                <h2 className="text-xl">Como você vai usar o Refuse It?</h2>
                <p className="mt-1 text-sm text-ink/70">O tipo da conta define o que você pode fazer na plataforma.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {tipos.map((op) => (
                  <button
                    key={op.valor}
                    type="button"
                    aria-pressed={tipo === op.valor}
                    onClick={() => setTipo(op.valor)}
                    className={`rounded-3xl p-5 text-left ring-2 transition duration-200 hover:-translate-y-1 ${
                      tipo === op.valor ? 'bg-brand-50 ring-brand-700' : 'bg-white ring-brand-100 hover:ring-brand-500'
                    }`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                      <op.icon size={22} />
                    </span>
                    <p className="mt-4 text-base font-bold text-brand-900">{op.titulo}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">{op.texto}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ETAPA 2 */}
          {etapa === 2 && (
            <>
              <h2 className="text-xl">Seus dados de acesso</h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField id="email" label="E-mail" required error={erroDe('email')}>
                  <input {...campo('email')} type="email" autoComplete="email" maxLength={150} placeholder="voce@exemplo.com" />
                </FormField>

                <FormField id="telefone" label="Telefone" required error={erroDe('telefone')} hint="Com DDD.">
                  <input
                    {...campo('telefone')}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(11) 91234-5678"
                    onChange={(e) => alterar('telefone', mascararTelefone(e.target.value))}
                  />
                </FormField>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  id="senha"
                  label="Senha"
                  required
                  error={erroDe('senha')}
                  hint="11 caracteres ou mais, com 1 maiúscula e 1 especial (! @ # $ % & *)."
                >
                  <div className="relative">
                    <input
                      {...campo('senha')}
                      type={mostrarSenha ? 'text' : 'password'}
                      autoComplete="new-password"
                      maxLength={72}
                      className={`${inputClasses(Boolean(erroDe('senha')))} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha((m) => !m)}
                      aria-label={mostrarSenha ? 'Ocultar senhas' : 'Mostrar senhas'}
                      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-brand-700 hover:bg-brand-50"
                    >
                      {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormField>

                <FormField id="confirmarSenha" label="Confirmar senha" required error={erroDe('confirmarSenha')}>
                  <input
                    {...campo('confirmarSenha')}
                    type={mostrarSenha ? 'text' : 'password'}
                    autoComplete="new-password"
                    maxLength={72}
                  />
                </FormField>
              </div>
            </>
          )}

          {/* ETAPA 3 */}
          {etapa === 3 && tipo && (
            <>
              <div>
                <h2 className="text-xl">{tipo === 'PESSOA_FISICA' ? 'Seu CPF e endereço' : 'CNPJ e endereço'}</h2>
                <p className="mt-1 text-sm text-ink/70">
                  O nome {tipo === 'PESSOA_FISICA' ? '' : 'e a razão social '}são buscados automaticamente pelo documento.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {tipo === 'PESSOA_FISICA' ? (
                  <FormField id="documento" label="CPF" required error={erroDe('documento')}>
                    <input
                      {...campo('documento')}
                      type="text"
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      onChange={(e) => alterar('documento', mascararCPF(e.target.value))}
                    />
                  </FormField>
                ) : (
                  <FormField id="documento" label="CNPJ" required error={erroDe('documento')}>
                    <input
                      {...campo('documento')}
                      type="text"
                      inputMode="numeric"
                      placeholder="00.000.000/0000-00"
                      onChange={(e) => alterar('documento', mascararCNPJ(e.target.value))}
                    />
                  </FormField>
                )}

                {tipo === 'EMPRESA' && (
                  <FormField id="categoria" label="Categoria" required error={erroDe('categoria')}>
                    <select {...campo('categoria')}>
                      <option value="">Selecione...</option>
                      {categorias.map((c) => (
                        <option key={c.valor} value={c.valor}>{c.rotulo}</option>
                      ))}
                    </select>
                  </FormField>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <FormField id="cep" label="CEP" required error={erroDe('cep')} hint={buscandoCep ? 'Buscando endereço...' : undefined}>
                  <input
                    {...campo('cep')}
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    onChange={(e) => void aoMudarCep(e.target.value)}
                  />
                </FormField>

                <FormField id="numero" label="Número" required error={erroDe('numero')} hint="Somente números.">
                  <input
                    {...campo('numero')}
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    onChange={(e) => alterar('numero', apenasDigitos(e.target.value))}
                  />
                </FormField>
              </div>

              {enderecoCep && (
                <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900 ring-1 ring-brand-100">
                  <strong>Endereço encontrado:</strong> {enderecoCep.endereco || 'Logradouro não informado'}
                  {valores.numero ? `, ${valores.numero}` : ''} · {enderecoCep.cidade} - {enderecoCep.estado}
                </p>
              )}
            </>
          )}

          {tentou && Object.keys(erros).length > 0 && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              Corrija os campos destacados para continuar.
            </p>
          )}

          {erroApi && (
            <div role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="font-semibold">{erroApi}</p>
              <p className="mt-1 text-xs">Confira o CPF ou CNPJ e o CEP. Se o erro continuar, tente de novo em instantes.</p>
            </div>
          )}

          {enviando && (
            <p className="text-xs text-ink/60">
              A consulta do documento pode levar alguns segundos. Não feche a página.
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {etapa > 1 ? (
              <Button type="button" variant="secondary" onClick={voltar} disabled={enviando || verificando}>
                <ArrowLeft size={18} /> Voltar
              </Button>
            ) : (
              <span />
            )}

            <Button type="submit" disabled={enviando || verificando || (etapa === 1 && !tipo)}>
              {etapa < 3 ? (
                verificando ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" /> Verificando...
                  </>
                ) : (
                  <>
                    Continuar <ArrowRight size={18} />
                  </>
                )
              ) : enviando ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" /> Criando conta...
                </>
              ) : (
                <>
                  <UserPlus size={18} /> Criar conta
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}