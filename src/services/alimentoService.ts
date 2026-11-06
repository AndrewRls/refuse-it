import { request } from './api'
import type { Alimento } from '../types'

export const alimentoService = {
  listar: () => request<Alimento[]>('/alimentos'),
}