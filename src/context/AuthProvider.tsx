import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { autenticar } from '../services/authService'
import type { Sessao } from '../types'

const CHAVE = 'refuseit:sessao'

function lerSessao(): Sessao | null {
  try {
    const bruto = localStorage.getItem(CHAVE)
    return bruto ? (JSON.parse(bruto) as Sessao) : null
  } catch {
    return null
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(lerSessao)

  const entrar = useCallback(async (email: string, senha: string) => {
    const nova = await autenticar({ email, senha })
    try {
      localStorage.setItem(CHAVE, JSON.stringify(nova))
    } catch { /* armazenamento indisponível: a sessão vale só até recarregar */ }
    setSessao(nova)
    return nova
  }, [])

  const sair = useCallback(() => {
    try {
      localStorage.removeItem(CHAVE)
    } catch { /* ignora */ }
    setSessao(null)
  }, [])

  const valor = useMemo(() => ({ sessao, entrar, sair }), [sessao, entrar, sair])

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}