import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  valor: number
  casas?: number
}

export default function CountUp({ valor, casas = 0 }: CountUpProps) {
  const [atual, setAtual] = useState(0)
  const atualRef = useRef(0)

  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duracao = reduzir ? 0 : 900
    const de = atualRef.current
    const inicio = performance.now()
    let frame = 0

    const passo = (agora: number) => {
      const t = duracao === 0 ? 1 : Math.min((agora - inicio) / duracao, 1)
      const suave = 1 - Math.pow(1 - t, 3)
      const v = de + (valor - de) * suave
      atualRef.current = v
      setAtual(v)
      if (t < 1) frame = requestAnimationFrame(passo)
    }

    frame = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(frame)
  }, [valor])

  return <>{atual.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })}</>
}