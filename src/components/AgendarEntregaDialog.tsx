import { useState } from 'react'
import type { FormEvent } from 'react'
import { LoaderCircle } from 'lucide-react'
import Button from './Button'
import FormField from './FormField'
import Modal from './Modal'
import { entregaService } from '../services/entregaService'
import type { ReservaView, TipoEntrega } from '../types'
import { dataHoraInput, dataISO, formatarQuantidade } from '../utils/format'
import { dataTextoParaISO, horaValida, isoParaTexto, mascararData, mascararHora } from '../utils/forms'
import { inputClasses } from '../utils/styles'

interface FormularioProps {
  reserva: ReservaView
  onFechar: () => void
  onAgendada: () => void
}

function Formulario({ reserva, onFechar, onAgendada }: FormularioProps) {
  const [tipo, setTipo] = useState<TipoEntrega>('RETIRADA')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [tentou, setTentou] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erroApi, setErroApi] = useState<string | null>(null)

  const limiteData = reserva.doacao?.dataLimiteRetirada.slice(0, 10)
  const iso = dataTextoParaISO(data)
  const quando = iso && horaValida(hora) ? `${iso}T${hora}` : ''

  function erroPrazo(): string | undefined {
    if (!quando) return undefined
    if (quando < dataHoraInput(0)) return `${data} às ${hora} já passou. Escolha um horário a partir de agora.`
    if (limiteData && quando > `${limiteData}T23:59`) {
      return `${data} às ${hora} passa do prazo limite de retirada (${isoParaTexto(limiteData)}).`
    }
    return undefined
  }

  function erroDoCampoData(): string | undefined {
    if (!data) return 'Informe a data.'
    if (!iso) return 'Data inválida. Use dia/mês/ano, por exemplo 07/11/2026.'
    return erroPrazo()
  }

  function erroDoCampoHora(): string | undefined {
    if (!hora) return 'Informe o horário.'
    if (!horaValida(hora)) return 'Horário inválido. Use horas e minutos, por exemplo 13:00.'
    return undefined
  }

  const erroD = erroDoCampoData()
  const erroH = erroDoCampoHora()
  const erroResponsavel = responsavel.length > 120 ? 'Use no máximo 120 caracteres.' : undefined

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setTentou(true)
    setErroApi(null)

    if (erroD || erroH || erroResponsavel) {
      document.getElementById(erroD ? 'data' : erroH ? 'hora' : 'responsavel')?.focus()
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

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="data"
            label="Data"
            required
            error={tentou ? erroD : undefined}
            hint={limiteData ? `Prazo limite: ${isoParaTexto(limiteData)}` : undefined}
          >
            <input
              id="data"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="dd/mm/aaaa"
              value={data}
              onChange={(e) => setData(mascararData(e.target.value))}
              aria-invalid={Boolean(tentou && erroD)}
              aria-describedby={tentou && erroD ? 'data-erro' : undefined}
              className={inputClasses(Boolean(tentou && erroD))}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setData(isoParaTexto(dataISO(0)))}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setData(isoParaTexto(dataISO(1)))}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100"
              >
                Amanhã
              </button>
            </div>
          </FormField>

          <FormField id="hora" label="Horário" required error={tentou ? erroH : undefined} hint="Formato 24 horas.">
            <input
              id="hora"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="hh:mm"
              value={hora}
              onChange={(e) => setHora(mascararHora(e.target.value))}
              aria-invalid={Boolean(tentou && erroH)}
              aria-describedby={tentou && erroH ? 'hora-erro' : undefined}
              className={inputClasses(Boolean(tentou && erroH))}
            />
          </FormField>
        </div>

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