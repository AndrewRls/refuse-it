import { request } from './api'
import type { Instituicao, NovaInstituicao } from '../types'

export const instituicaoService = {
  listar: () => request<Instituicao[]>('/instituicoes'),
  criar: (dados: NovaInstituicao) =>
    request<Instituicao>('/instituicoes', { method: 'POST', body: JSON.stringify(dados) }),
}