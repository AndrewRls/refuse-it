import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { autenticar } from '../services/authService'
import type { Sessao, TipoConta } from '../types'

// Chave nova: sessões do formato antigo (do mock) são ignoradas.
const CHAVE = 'refuseit:sessao:v2'

function lerSessao(): Sessao | null {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return null
    const sessao = JSON.parse(bruto) as Partial<Sessao>
    const validaTipo = sessao.tipo === 'PESSOA_FISICA' || sessao.tipo === 'EMPRESA' || sessao.tipo === 'ONG'
    return typeof sessao.idUsuario === 'number' && typeof sessao.nome === 'string' && validaTipo
      ? (sessao as Sessao)
      : null
  } catch {
    return null
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(lerSessao)

  const entrar = useCallback(async (email: string, senha: string, tipo: TipoConta) => {
    const nova = await autenticar(email, senha, tipo)
    try {
      localStorage.setItem(CHAVE, JSON.stringify(nova))
    } catch {
      /* armazenamento indisponível: a sessão vale só até recarregar */
    }
    setSessao(nova)
    return nova
  }, [])

  const sair = useCallback(() => {
    try {
      localStorage.removeItem(CHAVE)
    } catch {
      /* ignora */
    }
    setSessao(null)
  }, [])

  const valor = useMemo(() => ({ sessao, entrar, sair }), [sessao, entrar, sair])

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}