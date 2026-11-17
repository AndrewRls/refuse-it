import { ApiError } from './api'
import { doacoesApi } from './doacoesApi'
import type { DoacaoView } from '../types'

export function carregarCatalogo(): Promise<DoacaoView[]> {
  return doacoesApi.disponiveis()
}

/** A API não tem "buscar doação por id": procuramos na lista das disponíveis. */
export async function carregarDetalhe(id: number): Promise<DoacaoView> {
  const doacoes = await doacoesApi.disponiveis()
  const doacao = doacoes.find((d) => d.idDoacao === id)
  if (!doacao) throw new ApiError(404, 'Doação não encontrada ou não está mais disponível.')
  return doacao
}