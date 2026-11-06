import { request } from './api'
import type { Estabelecimento, NovoEstabelecimento } from '../types'

export const estabelecimentoService = {
  listar: () => request<Estabelecimento[]>('/estabelecimentos'),
  buscar: (id: number) => request<Estabelecimento>(`/estabelecimentos/${id}`),
  criar: (dados: NovoEstabelecimento) =>
    request<Estabelecimento>('/estabelecimentos', { method: 'POST', body: JSON.stringify(dados) }),
}