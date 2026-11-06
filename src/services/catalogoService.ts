import { doacaoService } from './doacaoService'
import { alimentoService } from './alimentoService'
import { estabelecimentoService } from './estabelecimentoService'
import type { DoacaoView } from '../types'

export async function carregarCatalogo(): Promise<DoacaoView[]> {
  const [doacoes, alimentos, estabelecimentos] = await Promise.all([
    doacaoService.listar(),
    alimentoService.listar(),
    estabelecimentoService.listar(),
  ])

  const alimentoPorId = new Map(alimentos.map((a) => [a.idAlimento, a]))
  const estabPorId = new Map(estabelecimentos.map((e) => [e.idEstabelecimento, e]))

  return doacoes.map((d) => ({
    ...d,
    alimento: alimentoPorId.get(d.idAlimento),
    estabelecimento: estabPorId.get(d.idEstabelecimento),
  }))
}

export async function carregarDetalhe(id: number): Promise<DoacaoView> {
  const doacao = await doacaoService.buscar(id)
  const [alimento, estabelecimento] = await Promise.all([
    alimentoService.buscar(doacao.idAlimento),
    estabelecimentoService.buscar(doacao.idEstabelecimento),
  ])
  return { ...doacao, alimento, estabelecimento }
}