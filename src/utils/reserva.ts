import type { MinhaReserva } from '../types'

const ENCERRADAS = ['CANCELADA', 'CONCLUIDA', 'RECUSADA']

/** Reserva que não pode mais ser cancelada nem está em andamento. */
export function reservaEncerrada(r: MinhaReserva): boolean {
  return ENCERRADAS.includes(r.status)
}