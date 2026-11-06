import { alimentoService } from './alimentoService'
import { doacaoService } from './doacaoService'
import { entregaService } from './entregaService'
import { estabelecimentoService } from './estabelecimentoService'
import { instituicaoService } from './instituicaoService'
import { reservaService } from './reservaService'
import type { PainelDados } from '../types'

export async function carregarPainel(): Promise<PainelDados> {
  const [doacoes, alimentos, estabelecimentos, instituicoes, reservas, entregas] = await Promise.all([
    doacaoService.listar(),
    alimentoService.listar(),
    estabelecimentoService.listar(),
    instituicaoService.listar(),
    reservaService.listar(),
    entregaService.listar(),
  ])
  return { doacoes, alimentos, estabelecimentos, instituicoes, reservas, entregas }
}