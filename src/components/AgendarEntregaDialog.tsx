import { useState } from 'react'
import type { FormEvent } from 'react'
import { LoaderCircle } from 'lucide-react'
import Button from './Button'
import FormField from './FormField'
import Modal from './Modal'
import { entregaService } from '../services/entregaService'
import type { ReservaView, TipoEntrega } from '../types'
import { dataHoraInput, formatarQuantidade } from '../utils/format'
import { inputClasses } from '../utils/styles'

interface FormularioProps {
  reserva: ReservaView
  onFechar: () => void
  onAgendada: () => void
}

function Formulario({ reserva, onFechar, onAgendada }: FormularioProps) {
  const [tipo, setTipo] = useState<TipoEntrega>('RETIRADA')
  const [quando, setQuando] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [tentou, setTentou] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erroApi, setErroApi] = useState<string | null>(null)

  const limite = reserva.doacao ? `${reserva.doacao.dataLimiteRetirada.slice(0, 10)}T23:59` : undefined

    const lido = quando
    ? new Date(quando).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })
    : ''

  function erroData(): string | undefined {
    if (!quando) return 'Informe a data e o horário.'
        if (quando < dataHoraInput(0)) return `O horário escolhido (${lido}) já passou.`
    if (limite && quando > limite) return `O horário escolhido (${lido}) passa do prazo limite de retirada.`
    return undefined
  }

  const erro = erroData()
  const erroResponsavel = responsavel.length > 120 ? 'Use no máximo 120 caracteres.' : undefined

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setTentou(true)
    setErroApi(null)

    if (erro || erroResponsavel) {
      document.getElementById(erro ? 'quando' : 'responsavel')?.focus()
      return
    }

    setEnviando(true)
    try {
      await entregaService.criar({
        idReserva: reserva.idReserva,
        dataAgendada: `${quando}:00`,
        tipoEntrega: tipo,
        responsavel: responsavel.trim() || undefined,
      })
      onAgendada()
    } catch (err) {
      setErroApi(err instanceof Error ? err.message : 'Não foi possível agendar.')
      setEnviando(false)
    }
  }

  const unidade = reserva.doacao?.alimento?.unidadeMedida

  return (
    <>
      <p className="mt-2 text-sm text-ink/70">
        {reserva.doacao?.alimento?.nome} · {formatarQuantidade(reserva.quantidadeSolicitada, unidade)} para{' '}
        <strong className="text-brand-900">{reserva.instituicao?.nome ?? 'a instituição'}</strong>
      </p>

      <form onSubmit={enviar} noValidate className="mt-6 space-y-5">
        <FormField id="tipo" label="Como será feito?" required>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoEntrega)}
            className={inputClasses(false)}
          >
            <option value="RETIRADA">Retirada: a instituição busca no local</option>
            <option value="ENTREGA">Entrega: o estabelecimento leva até a instituição</option>
          </select>
        </FormField>

        <FormField id="quando" label="Data e horário" required error={tentou ? erro : undefined}  hint={lido ? `Agendando para ${lido}` : 'Escolha pelo calendário do campo.'}>
          <input
            id="quando"
            type="datetime-local"
            min={dataHoraInput(0)}
            max={limite}
            value={quando}
            onChange={(e) => setQuando(e.target.value)}
            aria-invalid={Boolean(tentou && erro)}
            aria-describedby={tentou && erro ? 'quando-erro' : undefined}
            className={inputClasses(Boolean(tentou && erro))}
          />
        </FormField>

        <FormField
          id="responsavel"
          label="Responsável"
          error={tentou ? erroResponsavel : undefined}
          hint="Opcional. Quem vai retirar ou entregar."
        >
          <input
            id="responsavel"
            type="text"
            maxLength={120}
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            className={inputClasses(Boolean(tentou && erroResponsavel))}
          />
        </FormField>

        {erroApi && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {erroApi}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onFechar} disabled={enviando}>
            Voltar
          </Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? (
              <>
                <LoaderCircle size={16} className="animate-spin" /> Agendando...
              </>
            ) : (
              'Agendar'
            )}
          </Button>
        </div>
      </form>
    </>
  )
}

interface AgendarEntregaDialogProps {
  reserva: ReservaView | null
  onFechar: () => void
  onAgendada: () => void
}

export default function AgendarEntregaDialog({ reserva, onFechar, onAgendada }: AgendarEntregaDialogProps) {
  return (
    <Modal aberto={reserva !== null} titulo="Agendar entrega" onFechar={onFechar}>
      {reserva && <Formulario key={reserva.idReserva} reserva={reserva} onFechar={onFechar} onAgendada={onAgendada} />}
    </Modal>
  )
}