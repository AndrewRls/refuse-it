import { request } from './api'
import { normalizarAlimento } from './normalizadores'
import type { AlimentoApi } from './normalizadores'
import type { Alimento, UnidadeMedida } from '../types'

export interface NovoAlimento {
  nome: string
  unidadeMedida: UnidadeMedida
  categoria?: string
}

export const alimentoService = {
  listar: async (): Promise<Alimento[]> => {
    const lista = await request<AlimentoApi[]>('/alimentos')
    return lista.map(normalizarAlimento)
  },

  criar: async (dados: NovoAlimento): Promise<Alimento> => {
    const criado = await request<AlimentoApi>('/alimentos', { method: 'POST', body: JSON.stringify(dados) })
    return normalizarAlimento(criado)
  },
}