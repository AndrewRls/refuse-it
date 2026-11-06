import { alimentoService } from './alimentoService'
import { estabelecimentoService } from './estabelecimentoService'

export async function carregarOpcoes() {
  const [alimentos, estabelecimentos] = await Promise.all([
    alimentoService.listar(),
    estabelecimentoService.listar(),
  ])
  return { alimentos, estabelecimentos }
}