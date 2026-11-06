import { request } from './api'
import type { Estabelecimento } from '../types'

export const estabelecimentoService = {
  listar: () => request<Estabelecimento[]>('/estabelecimentos'),
}