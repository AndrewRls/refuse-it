import { AlertTriangle, RotateCcw } from 'lucide-react'
import Button from './Button'

interface ErrorMessageProps {
  mensagem: string
  onRetry?: () => void
}

export default function ErrorMessage({ mensagem, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="mx-auto max-w-lg rounded-3xl bg-red-50 p-8 text-center ring-1 ring-red-200">
      <AlertTriangle className="mx-auto text-red-600" size={36} />
      <h3 className="mt-4 text-lg text-red-800">Algo deu errado</h3>
      <p className="mt-2 text-sm text-red-700">{mensagem}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-6" onClick={onRetry}>
          <RotateCcw size={16} /> Tentar novamente
        </Button>
      )}
    </div>
  )
}