import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Check, CircleCheck, Eye, EyeOff, HeartHandshake, LoaderCircle, Store, UserPlus,
} from 'lucide-react'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { useAuth } from '../hooks/useAuth'
import { buscarCep } from '../services/cepService'
import { estabelecimentoService } from '../services/estabelecimentoService'
import { instituicaoService } from '../services/instituicaoService'
import { usuarioService } from '../services/usuarioService'
import type { CategoriaEstabelecimento } from '../types'
import {
  ESTADOS, apenasDigitos, cnpjValido, emailValido, mascararCEP, mascararCNPJ, mascararTelefone,
} from '../utils/forms'
import { inputClasses } from '../utils/styles'

type Tipo = 'DOADOR' | 'INSTITUICAO'
type Etapa = 1 | 2 | 3
type Elemento = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

interface Valores {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  telefone: string
  nomeFantasia: string
  razaoSocial: string
  nomeInstituicao: string
  cnpj: string
  categoria: string
  tipoInstituicao: string
  descricao: string
  cep: string
  endereco: string
  cidade: string
  estado: string
}

type Erros = Partial<Record<keyof Valores, string>>

const inicial: Valores = {
  nome: '', email: '', senha: '', confirmarSenha: '', telefone: '',
  nomeFantasia: '', razaoSocial: '', nomeInstituicao: '',
  cnpj: '', categoria: '', tipoInstituicao: '', descricao: '',
  cep: '', endereco: '', cidade: '', estado: '',
}

const categorias: { valor: CategoriaEstabelecimento; rotulo: string }[] = [
  { valor: 'RESTAURANTE', rotulo: 'Restaurante' },
  { valor: 'MERCADO', rotulo: 'Mercado' },
  { valor: 'PADARIA', rotulo: 'Padaria' },
  { valor: 'PRODUTOR', rotulo: 'Produtor rural' },
  { valor: 'OUTRO', rotulo: 'Outro' },
]

const tiposInstituicao = [
  'Cozinha comunitária', 'ONG', 'Abrigo', 'Associação de bairro', 'Entidade religiosa', 'Escola', 'Outro',
]

const nomesEtapas = ['Tipo de conta', 'Seus dados', 'Seu perfil']

function validarConta(v: Valores): Erros {
  const e: Erros = {}

  if (!v.nome.trim()) e.nome = 'Informe seu nome.'
  else if (v.nome.trim().length < 3) e.nome = 'O nome deve ter pelo menos 3 caracteres.'

  if (!v.email.trim()) e.email = 'Informe seu e-mail.'
  else if (!emailValido(v.email.trim())) e.email = 'Informe um e-mail válido.'

  if (!v.senha) e.senha = 'Crie uma senha.'
  else if (v.senha.length < 8) e.senha = 'Use pelo menos 8 caracteres.'

  if (!v.confirmarSenha) e.confirmarSenha = 'Confirme a senha.'
  else if (v.confirmarSenha !== v.senha) e.confirmarSenha = 'As senhas não conferem.'

  if (v.telefone) {
    const n = apenasDigitos(v.telefone).length
    if (n < 10 || n > 11) e.telefone = 'Informe o DDD e o número (10 ou 11 dígitos).'
  }

  return e
}

function validarPerfil(v: Valores, tipo: Tipo): Erros {
  const e: Erros = {}

  if (tipo === 'DOADOR') {
    if (!v.nomeFantasia.trim()) e.nomeFantasia = 'Informe o nome fantasia.'
    if (!v.razaoSocial.trim()) e.razaoSocial = 'Informe a razão social.'
    if (!v.cnpj) e.cnpj = 'Informe o CNPJ.'
    else if (!cnpjValido(v.cnpj)) e.cnpj = 'CNPJ inválido. Confira os números.'
    if (!v.categoria) e.categoria = 'Selecione a categoria.'
  } else {
    if (!v.nomeInstituicao.trim()) e.nomeInstituicao = 'Informe o nome da instituição.'
    if (v.cnpj && !cnpjValido(v.cnpj)) e.cnpj = 'CNPJ inválido. Confira os números.'
    if (!v.tipoInstituicao) e.tipoInstituicao = 'Selecione o tipo da instituição.'
    if (v.descricao.length > 500) e.descricao = 'Use no máximo 500 caracteres.'
  }

  if (apenasDigitos(v.cep).length !== 8) e.cep = 'Informe um CEP com 8 dígitos.'
  if (!v.endereco.trim()) e.endereco = 'Informe o endereço, com número.'
  if (!v.cidade.trim()) e.cidade = 'Informe a cidade.'
  if (!v.estado) e.estado = 'Selecione o estado.'

  return e
}

export default function Cadastro() {
  const { sessao, entrar } = useAuth()

  const [etapa, setEtapa] = useState<Etapa>(1)
  const [tipo, setTipo] = useState<Tipo | null>(null)
  const [valores, setValores] = useState<Valores>(inicial)
  const [tocados, setTocados] = useState<Partial<Record<keyof Valores, boolean>>>({})
  const [tentou, setTentou] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erroApi, setErroApi] = useState<string | null>(null)
  const [idUsuario, setIdUsuario] = useState<number | null>(null)
  const [concluido, setConcluido] = useState(false)
  const [entrouAuto, setEntrouAuto] = useState(false)

  const errosConta = useMemo(() => validarConta(valores), [valores])
  const errosPerfil = useMemo(() => (tipo ? validarPerfil(valores, tipo) : {}), [valores, tipo])
  const erros = etapa === 2 ? errosConta : errosPerfil

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

    if (apenasDigitos(mascarado).length === 8) {
      setBuscandoCep(true)
      const endereco = await buscarCep(mascarado)
      setBuscandoCep(false)
      if (endereco) {
        // Só preenche o que ainda está vazio, para não apagar o que a pessoa digitou
        setValores((v) => ({
          ...v,
          endereco: v.endereco || endereco.endereco,
          cidade: v.cidade || endereco.cidade,
          estado: v.estado || endereco.estado,
        }))
      }
    }
  }

  async function finalizar() {
    if (!tipo) return
    setErroApi(null)
    setEnviando(true)

    try {
      let id = idUsuario
      if (id === null) {
        const usuario = await usuarioService.criar({
          nome: valores.nome.trim(),
          email: valores.email.trim(),
          senha: valores.senha,
          telefone: apenasDigitos(valores.telefone) || undefined,
          tipoUsuario: tipo,
        })
        id = usuario.idUsuario
        setIdUsuario(id)
      }

      const endereco = {
        endereco: valores.endereco.trim(),
        cidade: valores.cidade.trim(),
        estado: valores.estado,
        cep: apenasDigitos(valores.cep),
      }

      if (tipo === 'DOADOR') {
        await estabelecimentoService.criar({
          idUsuario: id,
          nomeFantasia: valores.nomeFantasia.trim(),
          razaoSocial: valores.razaoSocial.trim(),
          cnpj: apenasDigitos(valores.cnpj),
          categoria: valores.categoria as CategoriaEstabelecimento,
          ...endereco,
        })
      } else {
        await instituicaoService.criar({
          idUsuario: id,
          nome: valores.nomeInstituicao.trim(),
          cnpj: apenasDigitos(valores.cnpj) || undefined,
          tipoInstituicao: valores.tipoInstituicao,
          descricao: valores.descricao.trim() || undefined,
          ...endereco,
        })
      }

      setConcluido(true)
      try {
        await entrar(valores.email.trim(), valores.senha)
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
              ? `Bem-vindo(a) ao Refuse It, ${valores.nome.trim().split(' ')[0]}. Você já está logado(a).`
              : 'Sua conta foi criada. Entre com seu e-mail e senha para continuar.'}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {!entrouAuto && <Button to="/login">Entrar</Button>}
            {entrouAuto && tipo === 'DOADOR' && <Button to="/doacoes/nova">Publicar minha primeira doação</Button>}
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

        <form
          onSubmit={avancar}
          noValidate
          className="mt-8 space-y-6 rounded-3xl bg-white p-6 ring-1 ring-brand-100 sm:p-8"
        >
          {/* ETAPA 1 */}
          {etapa === 1 && (
            <>
              <div>
                <h2 className="text-xl">Como você vai usar o Refuse It?</h2>
                <p className="mt-1 text-sm text-ink/70">Você poderá mudar isso falando com a equipe depois.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { valor: 'DOADOR' as Tipo, icon: Store, titulo: 'Quero doar', texto: 'Restaurante, mercado, padaria ou produtor com alimentos que sobraram.' },
                  { valor: 'INSTITUICAO' as Tipo, icon: HeartHandshake, titulo: 'Quero receber', texto: 'ONG, abrigo, cozinha comunitária ou outra entidade que atende pessoas.' },
                ].map((op) => (
                  <button
                    key={op.valor}
                    type="button"
                    aria-pressed={tipo === op.valor}
                    onClick={() => setTipo(op.valor)}
                    className={`rounded-3xl p-6 text-left ring-2 transition duration-200 hover:-translate-y-1 ${
                      tipo === op.valor ? 'bg-brand-50 ring-brand-700' : 'bg-white ring-brand-100 hover:ring-brand-500'
                    }`}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                      <op.icon size={24} />
                    </span>
                    <p className="mt-4 text-lg font-bold text-brand-900">{op.titulo}</p>
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

              <FormField id="nome" label="Nome completo" required error={erroDe('nome')}>
                <input {...campo('nome')} type="text" autoComplete="name" maxLength={120} />
              </FormField>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField id="email" label="E-mail" required error={erroDe('email')}>
                  <input {...campo('email')} type="email" autoComplete="email" maxLength={150} placeholder="voce@exemplo.com" />
                </FormField>

                <FormField id="telefone" label="Telefone" error={erroDe('telefone')} hint="Opcional. Com DDD.">
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
                <FormField id="senha" label="Senha" required error={erroDe('senha')} hint="Mínimo de 8 caracteres.">
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
              <h2 className="text-xl">{tipo === 'DOADOR' ? 'Dados do estabelecimento' : 'Dados da instituição'}</h2>

              {idUsuario !== null && erroApi && (
                <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  Sua conta de acesso já foi criada. Falta só concluir os dados abaixo.
                </p>
              )}

              {tipo === 'DOADOR' ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField id="nomeFantasia" label="Nome fantasia" required error={erroDe('nomeFantasia')}>
                      <input {...campo('nomeFantasia')} type="text" maxLength={120} />
                    </FormField>
                    <FormField id="razaoSocial" label="Razão social" required error={erroDe('razaoSocial')}>
                      <input {...campo('razaoSocial')} type="text" maxLength={150} />
                    </FormField>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField id="cnpj" label="CNPJ" required error={erroDe('cnpj')}>
                      <input
                        {...campo('cnpj')}
                        type="text"
                        inputMode="numeric"
                        placeholder="00.000.000/0000-00"
                        onChange={(e) => alterar('cnpj', mascararCNPJ(e.target.value))}
                      />
                    </FormField>
                    <FormField id="categoria" label="Categoria" required error={erroDe('categoria')}>
                      <select {...campo('categoria')}>
                        <option value="">Selecione...</option>
                        {categorias.map((c) => (
                          <option key={c.valor} value={c.valor}>{c.rotulo}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                </>
              ) : (
                <>
                  <FormField id="nomeInstituicao" label="Nome da instituição" required error={erroDe('nomeInstituicao')}>
                    <input {...campo('nomeInstituicao')} type="text" maxLength={120} />
                  </FormField>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField id="tipoInstituicao" label="Tipo" required error={erroDe('tipoInstituicao')}>
                      <select {...campo('tipoInstituicao')}>
                        <option value="">Selecione...</option>
                        {tiposInstituicao.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField id="cnpj" label="CNPJ" error={erroDe('cnpj')} hint="Opcional.">
                      <input
                        {...campo('cnpj')}
                        type="text"
                        inputMode="numeric"
                        placeholder="00.000.000/0000-00"
                        onChange={(e) => alterar('cnpj', mascararCNPJ(e.target.value))}
                      />
                    </FormField>
                  </div>

                  <FormField
                    id="descricao"
                    label="Sobre a instituição"
                    error={erroDe('descricao')}
                    hint={`Opcional. ${valores.descricao.length}/500 caracteres`}
                  >
                    <textarea {...campo('descricao')} rows={3} placeholder="Quem vocês atendem e quantas pessoas, por exemplo." />
                  </FormField>
                </>
              )}

              <div className="grid gap-6 sm:grid-cols-3">
                <FormField id="cep" label="CEP" required error={erroDe('cep')} hint={buscandoCep ? 'Buscando endereço...' : 'Preenche o endereço sozinho.'}>
                  <input
                    {...campo('cep')}
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    onChange={(e) => void aoMudarCep(e.target.value)}
                  />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField id="endereco" label="Endereço" required error={erroDe('endereco')} hint="Inclua o número.">
                    <input {...campo('endereco')} type="text" autoComplete="street-address" maxLength={250} />
                  </FormField>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <FormField id="cidade" label="Cidade" required error={erroDe('cidade')}>
                    <input {...campo('cidade')} type="text" maxLength={100} />
                  </FormField>
                </div>
                <FormField id="estado" label="Estado" required error={erroDe('estado')}>
                  <select {...campo('estado')}>
                    <option value="">UF</option>
                    {ESTADOS.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </>
          )}

          {tentou && Object.keys(erros).length > 0 && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              Corrija os campos destacados para continuar.
            </p>
          )}

          {erroApi && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {erroApi}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {etapa > 1 && idUsuario === null ? (
              <Button type="button" variant="secondary" onClick={voltar}>
                <ArrowLeft size={18} /> Voltar
              </Button>
            ) : (
              <span />
            )}

            <Button type="submit" disabled={enviando || (etapa === 1 && !tipo)}>
              {etapa < 3 ? (
                <>
                  Continuar <ArrowRight size={18} />
                </>
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