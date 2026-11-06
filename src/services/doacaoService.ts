import { request } from './api'
import type { Doacao, NovaDoacao } from '../types'

export const doacaoService = {
  listar: () => request<Doacao[]>('/doacoes'),
  buscar: (id: number) => request<Doacao>(`/doacoes/${id}`),
  criar: (dados: NovaDoacao) =>
    request<Doacao>('/doacoes', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id: number, dados: Partial<Doacao>) =>
    request<Doacao>(`/doacoes/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  remover: (id: number) => request<void>(`/doacoes/${id}`, { method: 'DELETE' }),
}