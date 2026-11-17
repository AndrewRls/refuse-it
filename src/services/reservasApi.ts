import { request } from './api'
import { normalizarReserva } from './normalizadores'
import type { ReservaApi } from './normalizadores'
import type { MinhaReserva } from '../types'

export const reservasApi = {
  /** Reservas feitas pela ONG logada. */
  doUsuario: async (idUsuario: number): Promise<MinhaReserva[]> => {
    const lista = await request<ReservaApi[]>(`/reservas/usuario/${idUsuario}`)
    return lista.map(normalizarReserva)
  },

  criar: (idUsuario: number, dados: { idDoacao: number; quantidadeSolicitada: number }) =>
    request<void>(`/reservas/usuario/${idUsuario}`, { method: 'POST', body: JSON.stringify(dados) }),

  cancelar: (idUsuario: number, idReserva: number) =>
    request<void>(`/reservas/usuario/${idUsuario}/${idReserva}/cancelar`, { method: 'PUT' }),
}