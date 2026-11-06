import { request } from './api'
import type { NovaReserva, Reserva } from '../types'

export const reservaService = {
  listar: () => request<Reserva[]>('/reservas'),
  criar: (dados: NovaReserva) =>
    request<Reserva>('/reservas', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id: number, dados: Reserva) =>
    request<Reserva>(`/reservas/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
}