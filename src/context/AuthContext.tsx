import { createContext } from 'react'
import type { Sessao, TipoConta } from '../types'

export interface AuthContextValue {
  sessao: Sessao | null
  entrar: (email: string, senha: string, tipo: TipoConta) => Promise<Sessao>
  sair: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)