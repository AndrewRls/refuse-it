import { request } from './api'
import type { TipoConta } from '../types'

export interface DadosCadastro {
  tipo: TipoConta
  email: string
  senha: string
  telefone: string
  documento: string
  categoria?: string
  cep: string
  numero: string
}

export const usuarioService = {
  /** GET /usuarios/email-existe?email=... devolve true ou false. */
  emailExiste: (email: string) => request<boolean>(`/usuarios/email-existe?email=${encodeURIComponent(email)}`),

  /**
   * Cadastro: cada tipo de conta tem a sua rota. O nome, a razão social e o endereço
   * completo são preenchidos pela própria API (Receita, CPFHub e ViaCEP).
   */
  cadastrar: (d: DadosCadastro) => {
    const endereco = { cep: d.cep, numero: d.numero }
    const base = { email: d.email, senha: d.senha, telefone: d.telefone, endereco }

    if (d.tipo === 'PESSOA_FISICA') {
      return request<void>('/pessoas-fisicas', { method: 'POST', body: JSON.stringify({ ...base, cpf: d.documento }) })
    }
    if (d.tipo === 'EMPRESA') {
      const categoria = encodeURIComponent(d.categoria ?? 'OUTRO')
      return request<void>(`/empresas?categoria=${categoria}`, {
        method: 'POST',
        body: JSON.stringify({ ...base, cnpj: d.documento }),
      })
    }
    return request<void>('/ongs', { method: 'POST', body: JSON.stringify({ ...base, cnpj: d.documento }) })
  },
}