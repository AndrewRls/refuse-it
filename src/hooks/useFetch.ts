import { useCallback, useEffect, useState } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/** O `fetcher` precisa ser uma função estável (declarada fora do componente). */
export function useFetch<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: e instanceof Error ? e.message : 'Erro inesperado.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [fetcher, tick])

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    setTick((t) => t + 1)
  }, [])

  return { ...state, reload }
}