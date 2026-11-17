import { request } from './api'
import { normalizarDoacao } from './normalizadores'
import type { DoacaoApi } from './normalizadores'
import type { DoacaoView } from '../types'

/** Corpo que a API espera para publicar uma doação. */
export interface NovaDoacaoApi {
  alimento: { idAlimento: number }
  quantidadeTotal: number
  dataValidade: string
  dataLimiteRetirada: string
  condicaoArmazenamento?: string
}

export const doacoesApi = {
  /** Doações que ainda podem ser reservadas (a API já filtra validade e saldo). */
  disponiveis: async (): Promise<DoacaoView[]> => {
    const lista = await request<DoacaoApi[]>('/doacoes/disponiveis')
    return lista.map(normalizarDoacao)
  },

  /** Todas as doações publicadas por um usuário (inclui canceladas e esgotadas). */
  doUsuario: async (idUsuario: number): Promise<DoacaoView[]> => {
    const lista = await request<DoacaoApi[]>(`/doacoes/usuario/${idUsuario}`)
    return lista.map(normalizarDoacao)
  },

  criar: (idUsuario: number, dados: NovaDoacaoApi) =>
    request<void>(`/doacoes/usuario/${idUsuario}`, { method: 'POST', body: JSON.stringify(dados) }),

  cancelar: (idUsuario: number, idDoacao: number) =>
    request<void>(`/doacoes/usuario/${idUsuario}/${idDoacao}/cancelar`, { method: 'PUT' }),
}