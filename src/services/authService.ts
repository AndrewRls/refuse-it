import { request } from './api'
import { estabelecimentoService } from './estabelecimentoService'
import { instituicaoService } from './instituicaoService'
import type { Credenciais, Sessao, Usuario } from '../types'

export async function autenticar(credenciais: Credenciais): Promise<Sessao> {
  const usuario = await request<Usuario>('/login', {
    method: 'POST',
    body: JSON.stringify(credenciais),
  })

  // Descobre o perfil vinculado ao usuário (tabelas com id_usuario único)
  if (usuario.tipoUsuario === 'DOADOR') {
    const lista = await estabelecimentoService.listar()
    return { usuario, estabelecimento: lista.find((e) => e.idUsuario === usuario.idUsuario) }
  }

  if (usuario.tipoUsuario === 'INSTITUICAO') {
    const lista = await instituicaoService.listar()
    return { usuario, instituicao: lista.find((i) => i.idUsuario === usuario.idUsuario) }
  }

  return { usuario }
}