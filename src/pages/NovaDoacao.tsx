import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { CircleCheck, Lightbulb, LoaderCircle, PackagePlus, Store } from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import FormField from '../components/FormField'
import Spinner from '../components/Spinner'
import { useFetch } from '../hooks/useFetch'
import { doacaoService } from '../services/doacaoService'
import { carregarOpcoes } from '../services/opcoesService'
import type { Doacao } from '../types'
import { dataISO, rotuloUnidade } from '../utils/format'
import { inputClasses } from '../utils/styles'
import { useAuth } from '../hooks/useAuth'
interface FormValores {
    idEstabelecimento: string
    idAlimento: string
    quantidadeTotal: string
    dataValidade: string
    dataLimiteRetirada: string
    condicaoArmazenamento: string
}

type Erros = Partial<Record<keyof FormValores, string>>

const inicial: FormValores = {
    idEstabelecimento: '',
    idAlimento: '',
    quantidadeTotal: '',
    dataValidade: '',
    dataLimiteRetirada: '',
    condicaoArmazenamento: '',
}

const dicas = [
    'Publique apenas alimentos próprios para consumo, dentro da validade e bem conservados.',
    'Informe corretamente como armazenar: refrigerado, congelado ou temperatura ambiente.',
    'Defina um prazo de retirada realista, de modo que a instituição consiga buscar a tempo.',
    'Mantenha os alimentos embalados e higienizados até a retirada.',
]

function validar(v: FormValores): Erros {
    const erros: Erros = {}

    if (!v.idEstabelecimento) erros.idEstabelecimento = 'Selecione o estabelecimento.'
    if (!v.idAlimento) erros.idAlimento = 'Selecione o alimento.'

    if (!v.quantidadeTotal) {
        erros.quantidadeTotal = 'Informe a quantidade.'
    } else {
        const qtd = Number(v.quantidadeTotal)
        if (Number.isNaN(qtd)) erros.quantidadeTotal = 'Informe um número válido.'
        else if (qtd <= 0) erros.quantidadeTotal = 'A quantidade deve ser maior que zero.'
        else if (qtd > 99_999_999.99) erros.quantidadeTotal = 'Quantidade acima do limite permitido.'
    }

    if (!v.dataValidade) {
        erros.dataValidade = 'Informe a data de validade.'
    } else if (v.dataValidade < dataISO(1)) {
        erros.dataValidade = 'A validade deve ser a partir de amanhã.'
    }

    if (!v.dataLimiteRetirada) {
        erros.dataLimiteRetirada = 'Informe o prazo limite para retirada.'
    } else if (v.dataLimiteRetirada < dataISO(0)) {
        erros.dataLimiteRetirada = 'O prazo não pode estar no passado.'
    } else if (v.dataValidade && v.dataLimiteRetirada > v.dataValidade) {
        erros.dataLimiteRetirada = 'A retirada deve ser até a data de validade.'
    }

    if (v.condicaoArmazenamento.length > 200) {
        erros.condicaoArmazenamento = 'Use no máximo 200 caracteres.'
    }

    return erros
}

export default function NovaDoacao() {
    const { sessao } = useAuth()
    const estabelecimentoLogado = sessao?.estabelecimento
    const idLogado = estabelecimentoLogado ? String(estabelecimentoLogado.idEstabelecimento) : ''
    const semCadastro = sessao?.usuario.tipoUsuario === 'DOADOR' && !estabelecimentoLogado

    const { data: opcoes, loading, error, reload } = useFetch(carregarOpcoes)

    const [valores, setValores] = useState<FormValores>({ ...inicial, idEstabelecimento: idLogado })
    const [tocados, setTocados] = useState<Partial<Record<keyof FormValores, boolean>>>({})
    const [enviou, setEnviou] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [erroApi, setErroApi] = useState<string | null>(null)
    const [criada, setCriada] = useState<Doacao | null>(null)

    const erros = useMemo(() => validar(valores), [valores])

    const alimentoSelecionado = opcoes?.alimentos.find((a) => a.idAlimento === Number(valores.idAlimento))

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
        setValores({ ...inicial, idEstabelecimento: idLogado })
        setTocados({})
        setEnviou(false)
        setErroApi(null)
        setCriada(null)
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

        setEnviando(true)
        try {
            const nova = await doacaoService.criar({
                idEstabelecimento: Number(valores.idEstabelecimento),
                idAlimento: Number(valores.idAlimento),
                quantidadeTotal: Number(valores.quantidadeTotal),
                dataValidade: valores.dataValidade,
                dataLimiteRetirada: valores.dataLimiteRetirada,
                condicaoArmazenamento: valores.condicaoArmazenamento.trim() || undefined,
            })
            setCriada(nova)
        } catch (err) {
            setErroApi(err instanceof Error ? err.message : 'Não foi possível publicar a doação.')
        } finally {
            setEnviando(false)
        }
    }

    const semOpcoes = opcoes && (opcoes.alimentos.length === 0 || opcoes.estabelecimentos.length === 0)

    return (
        <>
            <section className="bg-linear-to-b from-brand-50 to-white">
                <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6">
                    <p className="text-xs font-bold tracking-widest text-brand-700 uppercase">Doar</p>
                    <h1 className="mt-2 text-3xl sm:text-4xl">Publicar uma doação</h1>
                    <p className="mt-3 max-w-2xl text-ink/70">
                        Informe o que sobrou. Instituições da sua região poderão reservar e retirar.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
                {loading && <Spinner texto="Carregando formulário..." />}
                {!loading && error && <ErrorMessage mensagem={error} onRetry={reload} />}

                {!loading && !error && semOpcoes && (
                    <EmptyState
                        icon={Store}
                        titulo="Faltam dados para publicar"
                        texto="É preciso ter pelo menos um estabelecimento e um alimento cadastrados."
                    />
                )}

                {!loading && !error && semCadastro && (
                    <EmptyState
                        icon={Store}
                        titulo="Complete o cadastro do seu estabelecimento"
                        texto="Sua conta ainda não está vinculada a um estabelecimento. Finalize o cadastro para publicar doações."
                    />
                )}

                {/* Sucesso */}
                {!loading && !error && !semOpcoes && criada && (
                    <div className="mx-auto max-w-xl rounded-3xl bg-brand-50 p-10 text-center ring-1 ring-brand-100" role="status">
                        <CircleCheck className="mx-auto text-brand-700" size={52} />
                        <h2 className="mt-4 text-2xl">Doação publicada!</h2>
                        <p className="mt-2 text-ink/70">
                            Seu alimento já aparece no catálogo e pode ser reservado por instituições. Obrigado por
                            recusar o desperdício.
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
                {!loading && !error && opcoes && !semOpcoes && !semCadastro && !criada && (
                    <div className="grid gap-8 lg:grid-cols-3">
                        <form
                            onSubmit={enviar}
                            noValidate
                            className="space-y-6 rounded-3xl bg-white p-6 ring-1 ring-brand-100 sm:p-8 lg:col-span-2"
                        >
                            <div className="grid gap-6 sm:grid-cols-2">
                                {estabelecimentoLogado ? (
                                    <div>
                                        <p className="mb-1.5 text-sm font-bold text-brand-900">Estabelecimento</p>
                                        <p className="flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-900 ring-1 ring-brand-100">
                                            <Store size={16} className="text-brand-700" />
                                            {estabelecimentoLogado.nomeFantasia}
                                        </p>
                                    </div>
                                ) : (
                                    <FormField id="idEstabelecimento" label="Estabelecimento" required error={erroDe('idEstabelecimento')}>
                                        <select
                                            {...atributos('idEstabelecimento')}
                                            onChange={(e) => alterar('idEstabelecimento', e.target.value)}
                                        >
                                            <option value="">Selecione...</option>
                                            {opcoes.estabelecimentos.map((est) => (
                                                <option key={est.idEstabelecimento} value={est.idEstabelecimento}>
                                                    {est.nomeFantasia} · {est.cidade}/{est.estado}
                                                </option>
                                            ))}
                                        </select>
                                    </FormField>
                                )}

                                <FormField id="idAlimento" label="Alimento" required error={erroDe('idAlimento')}>
                                    <select {...atributos('idAlimento')} onChange={(e) => alterar('idAlimento', e.target.value)}>
                                        <option value="">Selecione...</option>
                                        {opcoes.alimentos.map((al) => (
                                            <option key={al.idAlimento} value={al.idAlimento}>
                                                {al.nome} ({rotuloUnidade(al.unidadeMedida)})
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
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
                                <FormField id="dataValidade" label="Data de validade" required error={erroDe('dataValidade')}>
                                    <input
                                        {...atributos('dataValidade')}
                                        type="date"
                                        min={dataISO(1)}
                                        onChange={(e) => alterar('dataValidade', e.target.value)}
                                    />
                                </FormField>

                                <FormField
                                    id="dataLimiteRetirada"
                                    label="Prazo limite de retirada"
                                    required
                                    error={erroDe('dataLimiteRetirada')}
                                >
                                    <input
                                        {...atributos('dataLimiteRetirada')}
                                        type="date"
                                        min={dataISO(0)}
                                        max={valores.dataValidade || undefined}
                                        onChange={(e) => alterar('dataLimiteRetirada', e.target.value)}
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