import { useEffect, useState } from 'react'

export default function Spinner({ texto = 'Carregando...' }: { texto?: string }) {
  const [demorando, setDemorando] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDemorando(true), 6000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div role="status" className="flex flex-col items-center gap-4 py-20 text-brand-700">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />
      <p className="text-sm font-semibold">{texto}</p>
      {demorando && (
        <p className="max-w-sm text-center text-xs text-ink/60">
          A API gratuita pode levar até 1 minuto para acordar na primeira visita. Aguarde só mais um pouco.
        </p>
      )}
    </div>
  )
}