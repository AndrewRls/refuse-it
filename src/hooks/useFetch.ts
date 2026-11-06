import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../services/api'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  status: number | null
}

/** O `fetcher` precisa ser uma função estável (declarada fora do componente ou com useCallback). */
export function useFetch<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null, status: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null, status: null })
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: e instanceof Error ? e.message : 'Erro inesperado.',
            status: e instanceof ApiError ? e.status : null,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [fetcher, tick])

  /** Recarrega mostrando o spinner. */
  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null, status: null }))
    setTick((t) => t + 1)
  }, [])

  /** Recarrega em segundo plano, sem piscar a tela. */
  const refresh = useCallback(() => setTick((t) => t + 1), [])

  return { ...state, reload, refresh }
}