import { useAuth } from './useAuth'
import type { Conta } from '../types'

/** Conta que está usando o sistema (ou null, se ninguém estiver logado). */
export function useConta(): Conta | null {
  return useAuth().sessao
}