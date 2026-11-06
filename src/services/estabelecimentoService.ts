import { request } from './api'
import type { Estabelecimento, NovoEstabelecimento } from '../types'

export const estabelecimentoService = {
  listar: () => request<Estabelecimento[]>('/estabelecimentos'),
  criar: (dados: NovoEstabelecimento) =>
    request<Estabelecimento>('/estabelecimentos', { method: 'POST', body: JSON.stringify(dados) }),
}