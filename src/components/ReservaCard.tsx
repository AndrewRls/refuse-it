import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Ban, CircleCheck, HeartHandshake, Info, LoaderCircle, LogIn, Store } from 'lucide-react'
import type { ReactNode } from 'react'
import Button from './Button'
import FormField from './FormField'
import { useAuth } from '../hooks/useAuth'
import { reservaService } from '../services/reservaService'
import type { DoacaoView, Reserva } from '../types'
import { podeReservar } from '../utils/doacao'
import { formatarQuantidade } from '../utils/format'
import { inputClasses } from '../utils/styles'

interface ReservaCardProps {
  doacao: DoacaoView
  /** Chamado depois de cada tentativa, para atualizar a disponibilidade na tela. */
  aoAtualizar: () => void
}

function Caixa({ children }: { children: ReactNode }) {
  return (
    <aside className="h-fit rounded-3xl bg-white p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 lg:sticky lg:top-24">
      {children}
    </aside>
  )
}

function Aviso({ icon: Icon, titulo, texto, children }: {
  icon: typeof Info
  titulo: string
  texto: string
  children?: ReactNode
}) {
  return (
    <Caixa>
      <div className="text-center">
        <Icon className="mx-auto text-brand-500" size={36} />
        <h2 className="mt-3 text-lg">{titulo}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{texto}</p>
        {children && <div className="mt-5 flex flex-col gap-3">{children}</div>}
      </div>
    </Caixa>
  )
}

export default function ReservaCard({ doacao, aoAtualizar }: ReservaCardProps) {
  const { sessao } = useAuth()
  const location = useLocation()
  const unidade = doacao.alimento?.unidadeMedida

  const [quantidade, setQuantidade] = useState('')
  const [observacao, setObservacao] = useState('')
  const [tentou, setTentou] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erroApi, setErroApi] = useState<string | null>(null)
  const [reserva, setReserva] = useState<Reserva | null>(null)

  function erroQuantidade(): string | undefined {
    if (!quantidade) return 'Informe a quantidade.'
    const n = Number(quantidade)
    if (Number.isNaN(n)) return 'Informe um número válido.'
    if (n <= 0) return 'A quantidade deve ser maior que zero.'
    if (Math.round(n * 100) / 100 !== n) return 'Use no máximo 2 casas decimais.'
    if (n > doacao.quantidadeDisponivel) {
      return `Há apenas ${formatarQuantidade(doacao.quantidadeDisponivel, unidade)} disponíveis.`
    }
    return undefined
  }

  const erroQtd = erroQuantidade()
  const erroObs = observacao.length > 500 ? 'Use no máximo 500 caracteres.' : undefined
  const mostrarErroQtd = tentou ? erroQtd : undefined

  /* ---------- Reserva feita ---------- */
  if (reserva) {
    return (
      <Caixa>
        <div role="status" className="text-center">
          <CircleCheck className="mx-auto text-brand-700" size={44} />
          <h2 className="mt-3 text-lg">Reserva solicitada!</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            Você pediu {formatarQuantidade(reserva.quantidadeSolicitada, unidade)}. O estabelecimento vai
            analisar o pedido, e você acompanha o andamento no seu painel.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Button to="/painel">Ir para o painel</Button>
            <Button to="/doacoes" variant="secondary">Ver outras doações</Button>
          </div>
        </div>
      </Caixa>
    )
  }

  /* ---------- Quem vê e o que pode fazer ---------- */
  if (!podeReservar(doacao)) {
    return (
      <Aviso
        icon={Ban}
        titulo="Doação indisponível"
        texto="Esta doação não aceita mais reservas: ela pode ter esgotado, vencido ou passado do prazo de retirada."
      >
        <Button to="/doacoes" variant="secondary">Ver outras doações</Button>
      </Aviso>
    )
  }

  if (!sessao) {
    return (
      <Aviso
        icon={LogIn}
        titulo="Entre para reservar"
        texto="Instituições cadastradas podem reservar alimentos. Entre ou crie a conta da sua instituição."
      >
        <Link
          to="/login"
          state={{ from: location.pathname }}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-700/25 transition hover:-translate-y-0.5 hover:bg-brand-900"
        >
          <LogIn size={18} /> Entrar
        </Link>
        <Button to="/cadastro" variant="secondary">Criar conta</Button>
      </Aviso>
    )
  }

  if (sessao.usuario.tipoUsuario !== 'INSTITUICAO') {
    const dona = sessao.estabelecimento?.idEstabelecimento === doacao.idEstabelecimento
    return (
      <Aviso
        icon={dona ? Store : Info}
        titulo={dona ? 'Esta doação é sua' : 'Reservas são para instituições'}
        texto={
          dona
            ? 'Acompanhe e gerencie as reservas recebidas no seu painel.'
            : 'Apenas contas de instituições sociais podem reservar alimentos.'
        }
      >
        {dona && <Button to="/painel">Abrir painel</Button>}
      </Aviso>
    )
  }

  const instituicao = sessao.instituicao
  if (!instituicao) {
    return (
      <Aviso
        icon={HeartHandshake}
        titulo="Complete o cadastro"
        texto="Sua conta ainda não está vinculada a uma instituição, então não é possível reservar."
      />
    )
  }

  /* ---------- Formulário ---------- */
  async function enviar(e: FormEvent) {
    e.preventDefault()
    setTentou(true)
    setErroApi(null)

    if (erroQtd || erroObs) {
      document.getElementById(erroQtd ? 'quantidade' : 'observacao')?.focus()
      return
    }

    setEnviando(true)
    try {
      const nova = await reservaService.criar({
        idDoacao: doacao.idDoacao,
        idInstituicao: instituicao!.idInstituicao,
        quantidadeSolicitada: Number(quantidade),
        observacao: observacao.trim() || undefined,
      })
      setReserva(nova)
    } catch (err) {
      setErroApi(err instanceof Error ? err.message : 'Não foi possível reservar.')
    } finally {
      setEnviando(false)
      aoAtualizar() // mostra a disponibilidade atual, tenha dado certo ou não
    }
  }

  return (
    <Caixa>
      <h2 className="text-xl">Reservar esta doação</h2>
      <p className="mt-1 text-sm text-ink/70">
        Reservando como <strong className="text-brand-900">{instituicao.nome}</strong>
      </p>

      <form onSubmit={enviar} noValidate className="mt-6 space-y-5">
        <FormField
          id="quantidade"
          label="Quantidade desejada"
          required
          error={mostrarErroQtd}
          hint={`Disponível: ${formatarQuantidade(doacao.quantidadeDisponivel, unidade)}`}
        >
          <input
            id="quantidade"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            aria-invalid={Boolean(mostrarErroQtd)}
            aria-describedby={mostrarErroQtd ? 'quantidade-erro' : undefined}
            className={inputClasses(Boolean(mostrarErroQtd))}
            placeholder="Ex.: 5"
          />
        </FormField>

        <button
          type="button"
          onClick={() => setQuantidade(String(doacao.quantidadeDisponivel))}
          className="-mt-2 text-xs font-bold text-brand-700 hover:text-brand-900"
        >
          Reservar tudo que está disponível
        </button>

        <FormField
          id="observacao"
          label="Observação"
          error={tentou ? erroObs : undefined}
          hint={`Opcional. ${observacao.length}/500 caracteres`}
        >
          <textarea
            id="observacao"
            rows={3}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            aria-invalid={Boolean(tentou && erroObs)}
            aria-describedby={tentou && erroObs ? 'observacao-erro' : undefined}
            className={inputClasses(Boolean(tentou && erroObs))}
            placeholder="Ex.: Retiramos às 16h com veículo próprio."
          />
        </FormField>

        {erroApi && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {erroApi}
          </p>
        )}

        <Button type="submit" disabled={enviando} className="w-full">
          {enviando ? (
            <>
              <LoaderCircle size={18} className="animate-spin" /> Enviando...
            </>
          ) : (
            'Solicitar reserva'
          )}
        </Button>
      </form>
    </Caixa>
  )
}