import { ApiError, request } from './api'
import type { Sessao, TipoConta } from '../types'

interface RespostaLogin {
  idUsuario: number
  nome?: string | null
  tipo?: string | null
}

export async function autenticar(email: string, senha: string, tipo: TipoConta): Promise<Sessao> {
  try {
    const r = await request<RespostaLogin>('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha, tipo }),
    })
    return { idUsuario: r.idUsuario, nome: r.nome?.trim() || 'Usuário', tipo }
  } catch (e) {
    // A API responde 401 sem corpo quando algo não confere
    if (e instanceof ApiError && e.status === 401) {
      throw new ApiError(401, 'E-mail, senha ou tipo de conta incorretos.')
    }
    throw e
  }
}