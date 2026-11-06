import { request } from './api'
import type { Entrega, NovaEntrega } from '../types'

export const entregaService = {
  listar: () => request<Entrega[]>('/entregas'),
  criar: (dados: NovaEntrega) =>
    request<Entrega>('/entregas', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id: number, dados: Entrega) =>
    request<Entrega>(`/entregas/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
}