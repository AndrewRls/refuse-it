import { createContext } from 'react'
import type { Sessao } from '../types'

export interface AuthContextValue {
  sessao: Sessao | null
  entrar: (email: string, senha: string) => Promise<Sessao>
  sair: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)