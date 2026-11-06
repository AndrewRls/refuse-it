import { request } from './api'
import type { Instituicao } from '../types'

export const instituicaoService = {
  listar: () => request<Instituicao[]>('/instituicoes'),
}