import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { CircleCheck, Lightbulb, LoaderCircle, PackagePlus, Plus } from 'lucide-react'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import FormField from '../components/FormField'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import { useConta } from '../hooks/useConta'
import { useFetch } from '../hooks/useFetch'
import { alimentoService } from '../services/alimentoService'
import { doacoesApi } from '../services/doacoesApi'
import type { Alimento, UnidadeMedida } from '../types'
import { dataISO, rotuloUnidade } from '../utils/format'
import { dataTextoParaISO, mascararData } from '../utils/forms'
import { inputClasses } from '../utils/styles'

interface FormValores {
  idAlimento: string
  quantidadeTotal: string
  dataValidade: string
  dataLimiteRetirada: string
  condicaoArmazenamento: string
}

type Erros = Partial<Record<keyof FormValores, string>>

const inicial: FormValores = {
  idAlimento: '',
  quantidadeTotal: '',
  dataValidade: '',
  dataLimiteRetirada: '',
  condicaoArmazenamento: '',
}

const unidades: UnidadeMedida[] = ['KG', 'GRAMA', 'LITRO', 'ML', 'UNIDADE']

const dicas = [
  'Publique apenas alimentos próprios para consumo, dentro da validade e bem conservados.',
  'Informe corretamente como armazenar: refrigerado, congelado ou temperatura ambiente.',
  'Defina um prazo de retirada realista, de modo que a ONG consiga buscar a tempo.',
  'Mantenha os alimentos embalados e higienizados até a retirada.',
]

function validar(v: FormValores): Erros {
  const erros: Erros = {}

  if (!v.idAlimento) erros.idAlimento = 'Selecione o alimento.'

  if (!v.quantidadeTotal) {
    erros.quantidadeTotal = 'Informe a quantidade.'
  } else {
    const qtd = Number(v.quantidadeTotal)
    if (Number.isNaN(qtd)) erros.quantidadeTotal = 'Informe um número válido.'
    else if (qtd <= 0) erros.quantidadeTotal = 'A quantidade deve ser maior que zero.'
    else if (qtd > 99_999_999.99) erros.quantidadeTotal = 'Quantidade acima do limite permitido.'
  }

  const validade = dataTextoParaISO(v.dataValidade)
  const retirada = dataTextoParaISO(v.dataLimiteRetirada)

  if (!v.dataValidade) {
    erros.dataValidade = 'Informe a data de validade.'
  } else if (!validade) {
    erros.dataValidade = 'Data inválida. Use dia/mês/ano, por exemplo 25/11/2026.'
  } else if (validade < dataISO(1)) {
    erros.dataValidade = 'A validade deve ser a partir de amanhã.'
  } else if (validade > dataISO(365 * 5)) {
    erros.dataValidade = 'A validade pode ser de no máximo 5 anos.'
  }

  if (!v.dataLimiteRetirada) {
    erros.dataLimiteRetirada = 'Informe o prazo limite para retirada.'
  } else if (!retirada) {
    erros.dataLimiteRetirada = 'Data inválida. Use dia/mês/ano, por exemplo 25/11/2026.'
  } else if (retirada < dataISO(0)) {
    erros.dataLimiteRetirada = 'O prazo não pode estar no passado.'
  } else if (validade && retirada > validade) {
    erros.dataLimiteRetirada = 'A retirada deve ser até a data de validade.'
  }

  if (v.condicaoArmazenamento.length > 200) {
    erros.condicaoArmazenamento = 'Use no máximo 200 caracteres.'
  }

  return erros
}

export default function NovaDoacao() {
  const conta = useConta()
  const { data: alimentosApi, loading, error, reload } = useFetch(alimentoService.listar)

  const [valores, setValores] = useState<FormValores>(inicial)
  const [tocados, setTocados] = useState<Partial<Record<keyof FormValores, boolean>>>({})
  const [enviou, setEnviou] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erroApi, setErroApi] = useState<string | null>(null)
  const [criada, setCriada] = useState(false)

  // Alimento novo (cadastro rápido)
  const [extras, setExtras] = useState<Alimento[]>([])
  const [novoAberto, setNovoAberto] = useState(false)
  const [novoNome, setNovoNome] = useState('')
  const [novaUnidade, setNovaUnidade] = useState<UnidadeMedida>('KG')
  const [novaCategoria, setNovaCategoria] = useState('')
  const [novoErro, setNovoErro] = useState<string | null>(null)
  const [novoEnviando, setNovoEnviando] = useState(false)

  const erros = useMemo(() => validar(valores), [valores])

  const alimentos = useMemo(() => {
    const lista = [...(alimentosApi ?? [])]
    for (const extra of extras) if (!lista.some((a) => a.idAlimento === extra.idAlimento)) lista.push(extra)
    return lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [alimentosApi, extras])

  const alimentoSelecionado = alimentos.find((a) => a.idAlimento === Number(valores.idAlimento))

  function alterar(campo: keyof FormValores, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }))
  }

  function erroDe(campo: keyof FormValores): string | undefined {
    return enviou || tocados[campo] ? erros[campo] : undefined
  }

  function atributos(campo: keyof FormValores) {
    const erro = erroDe(campo)
    return {
      id: campo,
      value: valores[campo],
      onBlur: () => setTocados((t) => ({ ...t, [campo]: true })),
      'aria-invalid': Boolean(erro),
      'aria-describedby': erro ? `${campo}-erro` : undefined,
      className: inputClasses(Boolean(erro)),
    }
  }

  function reiniciar() {
    setValores(inicial)
    setTocados({})
    setEnviou(false)
    setErroApi(null)
    setCriada(false)
  }

  async function cadastrarAlimento() {
    setNovoErro(null)
    const nome = novoNome.trim()
    if (!nome) {
      setNovoErro('Informe o nome do alimento.')
      return
    }
    if (nome.length > 100) {
      setNovoErro('O nome pode ter no máximo 100 caracteres.')
      return
    }

    setNovoEnviando(true)
    try {
      const criado = await alimentoService.criar({
        nome,
        unidadeMedida: novaUnidade,
        categoria: novaCategoria.trim() || undefined,
      })
      setExtras((atual) => [...atual, criado])
      alterar('idAlimento', String(criado.idAlimento))
      setNovoAberto(false)
      setNovoNome('')
      setNovaCategoria('')
    } catch (err) {
      setNovoErro(err instanceof Error ? err.message : 'Não foi possível cadastrar o alimento.')
    } finally {
      setNovoEnviando(false)
    }
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviou(true)
    setErroApi(null)

    const campos = Object.keys(erros) as (keyof FormValores)[]
    if (campos.length > 0) {
      document.getElementById(campos[0])?.focus()
      return
    }

    const validade = dataTextoParaISO(valores.dataValidade)
    const retirada = dataTextoParaISO(valores.dataLimiteRetirada)
    if (!validade || !retirada || !conta) return

    setEnviando(true)
    try {
      await doacoesApi.criar(conta.idUsuario, {
        alimento: { idAlimento: Number(valores.idAlimento) },
        quantidadeTotal: Number(valores.quantidadeTotal),
        dataValidade: validade,
        dataLimiteRetirada: retirada,
        condicaoArmazenamento: valores.condicaoArmazenamento.trim() || undefined,
      })
      setCriada(true)
    } catch (err) {
      setErroApi(err instanceof Error ? err.message : 'Não foi possível publicar a doação.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <PageHeader
        titulo="Publicar uma doação"
        rotulo="Nova doação"
        descricao="Informe o que sobrou. ONGs poderão reservar e retirar."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {loading && <Spinner texto="Carregando formulário..." />}
        {!loading && error && <ErrorMessage mensagem={error} onRetry={reload} />}

        {/* Sucesso */}
        {!loading && !error && criada && (
          <div className="mx-auto max-w-xl rounded-3xl bg-brand-50 p-10 text-center ring-1 ring-brand-100" role="status">
            <CircleCheck className="mx-auto text-brand-700" size={52} />
            <h2 className="mt-4 text-2xl">Doação publicada!</h2>
            <p className="mt-2 text-ink/70">
              Seu alimento já aparece no catálogo e pode ser reservado por ONGs. Obrigado por recusar o desperdício.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to="/doacoes">Ver no catálogo</Button>
              <Button variant="secondary" onClick={reiniciar}>
                Publicar outra
              </Button>
            </div>
          </div>
        )}

        {/* Formulário */}
        {!loading && !error && !criada && (
          <div className="grid gap-8 lg:grid-cols-3">
            <form
              onSubmit={(ev) => void enviar(ev)}
              noValidate
              className="space-y-6 rounded-3xl bg-white p-6 ring-1 ring-brand-100 sm:p-8 lg:col-span-2"
            >
              <div>
                <FormField id="idAlimento" label="Alimento" required error={erroDe('idAlimento')}>
                  <select {...atributos('idAlimento')} onChange={(e) => alterar('idAlimento', e.target.value)}>
                    <option value="">Selecione...</option>
                    {alimentos.map((al) => (
                      <option key={al.idAlimento} value={al.idAlimento}>
                        {al.nome} ({rotuloUnidade(al.unidadeMedida)})
                      </option>
                    ))}
                  </select>
                </FormField>

                <button
                  type="button"
                  onClick={() => setNovoAberto((a) => !a)}
                  aria-expanded={novoAberto}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900"
                >
                  <Plus size={14} /> {novoAberto ? 'Fechar cadastro de alimento' : 'Não achou o alimento? Cadastre um novo'}
                </button>

                {novoAberto && (
                  <div className="mt-3 space-y-4 rounded-lg bg-brand-50 p-4 ring-1 ring-brand-100">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label htmlFor="novoNome" className="mb-1.5 block text-sm font-bold text-brand-900">Nome do alimento</label>
                        <input
                          id="novoNome"
                          type="text"
                          maxLength={100}
                          value={novoNome}
                          onChange={(e) => setNovoNome(e.target.value)}
                          className={inputClasses(Boolean(novoErro))}
                          placeholder="Ex.: Pão de forma"
                        />
                      </div>
                      <div>
                        <label htmlFor="novaUnidade" className="mb-1.5 block text-sm font-bold text-brand-900">Unidade</label>
                        <select
                          id="novaUnidade"
                          value={novaUnidade}
                          onChange={(e) => setNovaUnidade(e.target.value as UnidadeMedida)}
                          className={inputClasses(false)}
                        >
                          {unidades.map((u) => (
                            <option key={u} value={u}>{rotuloUnidade(u)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="novaCategoria" className="mb-1.5 block text-sm font-bold text-brand-900">Categoria (opcional)</label>
                      <input
                        id="novaCategoria"
                        type="text"
                        maxLength={40}
                        value={novaCategoria}
                        onChange={(e) => setNovaCategoria(e.target.value)}
                        className={inputClasses(false)}
                        placeholder="Ex.: Panificados"
                      />
                    </div>

                    {novoErro && (
                      <p role="alert" className="text-sm font-semibold text-red-700">{novoErro}</p>
                    )}

                    <Button type="button" onClick={() => void cadastrarAlimento()} disabled={novoEnviando}>
                      {novoEnviando ? (
                        <>
                          <LoaderCircle size={16} className="animate-spin" /> Cadastrando...
                        </>
                      ) : (
                        'Cadastrar alimento'
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <FormField
                id="quantidadeTotal"
                label="Quantidade total"
                required
                error={erroDe('quantidadeTotal')}
                hint={alimentoSelecionado ? `Em ${rotuloUnidade(alimentoSelecionado.unidadeMedida)}` : 'Selecione o alimento para ver a unidade.'}
              >
                <div className="relative">
                  <input
                    {...atributos('quantidadeTotal')}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="Ex.: 12.5"
                    onChange={(e) => alterar('quantidadeTotal', e.target.value)}
                    className={`${inputClasses(Boolean(erroDe('quantidadeTotal')))} pr-14`}
                  />
                  {alimentoSelecionado && (
                    <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold text-brand-700">
                      {rotuloUnidade(alimentoSelecionado.unidadeMedida)}
                    </span>
                  )}
                </div>
              </FormField>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  id="dataValidade"
                  label="Data de validade"
                  required
                  error={erroDe('dataValidade')}
                  hint="Formato dia/mês/ano. A partir de amanhã."
                >
                  <input
                    {...atributos('dataValidade')}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="dd/mm/aaaa"
                    onChange={(e) => alterar('dataValidade', mascararData(e.target.value))}
                  />
                </FormField>

                <FormField
                  id="dataLimiteRetirada"
                  label="Prazo limite de retirada"
                  required
                  error={erroDe('dataLimiteRetirada')}
                  hint="De hoje até a data de validade."
                >
                  <input
                    {...atributos('dataLimiteRetirada')}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="dd/mm/aaaa"
                    onChange={(e) => alterar('dataLimiteRetirada', mascararData(e.target.value))}
                  />
                </FormField>
              </div>

              <FormField
                id="condicaoArmazenamento"
                label="Condição de armazenamento"
                error={erroDe('condicaoArmazenamento')}
                hint={`Opcional. ${valores.condicaoArmazenamento.length}/200 caracteres`}
              >
                <textarea
                  {...atributos('condicaoArmazenamento')}
                  rows={3}
                  placeholder="Ex.: Manter refrigerado entre 2 e 8 °C"
                  onChange={(e) => alterar('condicaoArmazenamento', e.target.value)}
                />
              </FormField>

              {enviou && Object.keys(erros).length > 0 && (
                <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  Corrija os campos destacados para continuar.
                </p>
              )}

              {erroApi && (
                <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {erroApi}
                </p>
              )}

              <Button type="submit" disabled={enviando} className="w-full sm:w-auto">
                {enviando ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" /> Publicando...
                  </>
                ) : (
                  <>
                    <PackagePlus size={18} /> Publicar doação
                  </>
                )}
              </Button>
            </form>

            <aside className="h-fit rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100 lg:sticky lg:top-24">
              <p className="flex items-center gap-2 text-base font-bold text-brand-900">
                <Lightbulb size={20} className="text-brand-700" /> Antes de publicar
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/70">
                {dicas.map((d) => (
                  <li key={d} className="flex gap-3">
                    <CircleCheck size={18} className="mt-0.5 shrink-0 text-brand-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        )}
      </section>
    </>
  )
}