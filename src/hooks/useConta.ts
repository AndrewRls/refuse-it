import { useAuth } from './useAuth'
import type { Conta } from '../types'

/**
 * Conta que está usando o sistema (ou null).
 * Temporário: traduz o formato antigo da sessão. Será simplificado no commit da autenticação.
 */
export function useConta(): Conta | null {
  const { sessao } = useAuth()
  if (!sessao || sessao.usuario.tipoUsuario === 'ADMIN') return null

  return {
    idUsuario: sessao.usuario.idUsuario,
    nome: sessao.usuario.nome,
    tipo: sessao.usuario.tipoUsuario === 'INSTITUICAO' ? 'ONG' : 'EMPRESA',
  }
}