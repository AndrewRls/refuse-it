import type { ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'

interface ConfirmDialogProps {
  aberto: boolean
  titulo: string
  children: ReactNode
  rotuloConfirmar: string
  perigo?: boolean
  carregando?: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ConfirmDialog({
  aberto, titulo, children, rotuloConfirmar, perigo = false, carregando = false, onConfirmar, onCancelar,
}: ConfirmDialogProps) {
  return (
    <Modal aberto={aberto} titulo={titulo} onFechar={onCancelar} bloqueado={carregando}>
      <div className="mt-3 text-sm leading-relaxed text-ink/70">{children}</div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancelar} disabled={carregando}>
          Voltar
        </Button>

        {perigo ? (
          <button
            type="button"
            onClick={onConfirmar}
            disabled={carregando}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando && <LoaderCircle size={16} className="animate-spin" />} {rotuloConfirmar}
          </button>
        ) : (
          <Button onClick={onConfirmar} disabled={carregando}>
            {carregando && <LoaderCircle size={16} className="animate-spin" />} {rotuloConfirmar}
          </Button>
        )}
      </div>
    </Modal>
  )
}