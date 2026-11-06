import type { Doacao } from '../types'
import { diasParaVencer } from './format'

export function podeReservar(d: Doacao): boolean {
  return (
    (d.status === 'DISPONIVEL' || d.status === 'PARCIALMENTE_RESERVADA') &&
    d.quantidadeDisponivel > 0 &&
    diasParaVencer(d.dataValidade) >= 0 &&
    diasParaVencer(d.dataLimiteRetirada) >= 0
  )
}