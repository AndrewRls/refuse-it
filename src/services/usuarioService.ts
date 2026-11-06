import { request } from './api'
import type { NovoUsuario, Usuario } from '../types'

export const usuarioService = {
  criar: (dados: NovoUsuario) =>
    request<Usuario>('/usuarios', { method: 'POST', body: JSON.stringify(dados) }),
}