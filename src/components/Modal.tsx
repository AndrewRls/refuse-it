import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  aberto: boolean
  titulo: string
  onFechar: () => void
  /** Impede fechar (ex.: enquanto uma requisição está em andamento). */
  bloqueado?: boolean
  children: ReactNode
}

export default function Modal({ aberto, titulo, onFechar, bloqueado = false, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const tituloId = useId()

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (aberto && !dialogo.open) dialogo.showModal()
    else if (!aberto && dialogo.open) dialogo.close()
  }, [aberto])

  return (
    <dialog
      ref={ref}
      aria-labelledby={tituloId}
      onCancel={(e) => {
        e.preventDefault()
        if (!bloqueado) onFechar()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !bloqueado) onFechar()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-white p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      {aberto && (
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id={tituloId} className="text-xl">{titulo}</h2>
            <button
              type="button"
              onClick={onFechar}
              disabled={bloqueado}
              aria-label="Fechar"
              className="rounded-lg p-1.5 text-brand-700 hover:bg-brand-50 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}