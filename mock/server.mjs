// Servidor falso SOMENTE para desenvolvimento. Não faz parte da entrega.
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'

const PORT = 8080
const ler = (arquivo) => JSON.parse(readFileSync(new URL(arquivo, import.meta.url), 'utf-8'))
const db = { ...ler('./db.json'), ...ler('./auth.json') }

const campoId = {
  doacoes: 'idDoacao',
  alimentos: 'idAlimento',
  estabelecimentos: 'idEstabelecimento',
  instituicoes: 'idInstituicao',
  reservas: 'idReserva',
  usuarios: 'idUsuario',
}
for (const recurso of Object.keys(campoId)) db[recurso] ??= []

// A API real nunca devolve a senha
const semSenha = ({ senha, ...resto }) => resto
const publico = (recurso, valor) => {
  if (recurso !== 'usuarios') return valor
  return Array.isArray(valor) ? valor.map(semSenha) : semSenha(valor)
}

const dataLocal = (offset = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('sv-SE') // AAAA-MM-DD
}

// Espelha as constraints CHECK do DDL
function validarDoacao(b) {
  if (!db.estabelecimentos.some((e) => e.idEstabelecimento === b.idEstabelecimento)) return 'Estabelecimento inexistente.'
  if (!db.alimentos.some((a) => a.idAlimento === b.idAlimento)) return 'Alimento inexistente.'
  if (typeof b.quantidadeTotal !== 'number' || b.quantidadeTotal <= 0) return 'A quantidade total deve ser maior que zero.'
  if (!b.dataValidade || b.dataValidade <= dataLocal()) return 'A data de validade deve ser posterior à data de hoje.'
  if (!b.dataLimiteRetirada || b.dataLimiteRetirada < dataLocal() || b.dataLimiteRetirada > b.dataValidade)
    return 'A data limite de retirada deve estar entre hoje e a data de validade.'
  if (b.condicaoArmazenamento && b.condicaoArmazenamento.length > 200)
    return 'A condição de armazenamento deve ter no máximo 200 caracteres.'
  return null
}

function validarUsuario(b) {
  if (!String(b.nome ?? '').trim()) return 'Informe o nome.'
  if (!/^\S+@\S+\.\S+$/.test(String(b.email ?? ''))) return 'E-mail inválido.'
  if (String(b.senha ?? '').length < 6) return 'A senha deve ter pelo menos 6 caracteres.'
  if (!['DOADOR', 'INSTITUICAO'].includes(b.tipoUsuario)) return 'Tipo de usuário inválido.'
  return null
}

function validarPerfil(recurso, b) {
  const lista = db[recurso]
  if (!db.usuarios.some((u) => u.idUsuario === b.idUsuario)) return { status: 400, message: 'Usuário inexistente.' }
  if (lista.some((p) => p.idUsuario === b.idUsuario))
    return { status: 409, message: 'Este usuário já possui um perfil cadastrado.' }

  const cnpj = String(b.cnpj ?? '')
  if (recurso === 'estabelecimentos' || cnpj) {
    if (!/^\d{14}$/.test(cnpj)) return { status: 400, message: 'O CNPJ deve ter 14 dígitos.' }
    if (lista.some((p) => p.cnpj === cnpj)) return { status: 409, message: 'Este CNPJ já está cadastrado.' }
  }
  if (!/^\d{8}$/.test(String(b.cep ?? ''))) return { status: 400, message: 'O CEP deve ter 8 dígitos.' }
  if (!/^[A-Z]{2}$/.test(String(b.estado ?? ''))) return { status: 400, message: 'O estado deve ter 2 letras.' }
  return null
}

function recalcularStatusDoacao(d) {
  if (d.status === 'CANCELADA' || d.status === 'EXPIRADA') return
  if (d.quantidadeDisponivel <= 0) d.status = 'ESGOTADA'
  else if (d.quantidadeDisponivel < d.quantidadeTotal) d.status = 'PARCIALMENTE_RESERVADA'
  else d.status = 'DISPONIVEL'
}

function validarReserva(b) {
  const doacao = db.doacoes.find((d) => d.idDoacao === b.idDoacao)
  if (!doacao) return { status: 400, message: 'Doação inexistente.' }
  if (!db.instituicoes.some((i) => i.idInstituicao === b.idInstituicao))
    return { status: 400, message: 'Instituição inexistente.' }
  if (typeof b.quantidadeSolicitada !== 'number' || b.quantidadeSolicitada <= 0)
    return { status: 400, message: 'A quantidade solicitada deve ser maior que zero.' }
  if (b.observacao && b.observacao.length > 500)
    return { status: 400, message: 'A observação deve ter no máximo 500 caracteres.' }
  if (!['DISPONIVEL', 'PARCIALMENTE_RESERVADA'].includes(doacao.status) || doacao.dataLimiteRetirada < dataLocal())
    return { status: 409, message: 'Esta doação não está mais disponível para reserva.' }
  if (b.quantidadeSolicitada > doacao.quantidadeDisponivel)
    return { status: 409, message: `Quantidade indisponível. Restam ${doacao.quantidadeDisponivel}.` }
  return null
}

async function lerCorpo(req) {
  const partes = []
  for await (const parte of req) partes.push(parte)
  try {
    return JSON.parse(Buffer.concat(partes).toString() || '{}')
  } catch {
    return null
  }
}

createServer(async (req, res) => {
  const enviar = (status, corpo, extras = {}) => {
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Expose-Headers': 'Location',
      ...extras,
    })
    res.end(corpo === undefined ? undefined : JSON.stringify(corpo))
  }

  if (req.method === 'OPTIONS') return enviar(204)

  const [, recurso, idTxt] = new URL(req.url, 'http://localhost').pathname.split('/')

  // Login
  if (recurso === 'login') {
    if (req.method !== 'POST') return enviar(405, { message: 'Método não suportado.' })
    const corpo = await lerCorpo(req)
    if (!corpo?.email || !corpo?.senha) return enviar(400, { message: 'Informe e-mail e senha.' })

    const usuario = db.usuarios.find((u) => u.email.toLowerCase() === String(corpo.email).toLowerCase())
    if (!usuario || usuario.senha !== corpo.senha) return enviar(401, { message: 'E-mail ou senha inválidos.' })
    if (usuario.status !== 'ATIVO') return enviar(403, { message: 'Esta conta está inativa.' })
    return enviar(200, semSenha(usuario))
  }

  const chave = campoId[recurso]
  if (!chave) return enviar(404, { message: 'Recurso não encontrado.' })

  const lista = db[recurso]
  const id = idTxt === undefined ? null : Number(idTxt)
  const item = id === null ? null : lista.find((x) => x[chave] === id)

  if (req.method === 'GET') {
    if (id === null) return enviar(200, publico(recurso, lista))
    return item ? enviar(200, publico(recurso, item)) : enviar(404, { message: 'Registro não encontrado.' })
  }

  if (req.method === 'POST' && id === null) {
    const corpo = await lerCorpo(req)
    if (!corpo) return enviar(400, { message: 'JSON inválido.' })

    const novo = { ...corpo }

    if (recurso === 'doacoes') {
      const erro = validarDoacao(corpo)
      if (erro) return enviar(400, { message: erro })
      Object.assign(novo, {
        quantidadeDisponivel: corpo.quantidadeTotal,
        dataPublicacao: new Date().toISOString().slice(0, 19),
        status: 'DISPONIVEL',
      })
    }

    if (recurso === 'usuarios') {
      const erro = validarUsuario(corpo)
      if (erro) return enviar(400, { message: erro })
      if (db.usuarios.some((u) => u.email.toLowerCase() === corpo.email.toLowerCase()))
        return enviar(409, { message: 'Este e-mail já está cadastrado.' })
      Object.assign(novo, { dataCadastro: new Date().toISOString().slice(0, 19), status: 'ATIVO' })
    }

    if (recurso === 'estabelecimentos' || recurso === 'instituicoes') {
      const erro = validarPerfil(recurso, corpo)
      if (erro) return enviar(erro.status, { message: erro.message })
    }
    if (recurso === 'reservas') {
      const erro = validarReserva(corpo)
      if (erro) return enviar(erro.status, { message: erro.message })
      const doacao = db.doacoes.find((d) => d.idDoacao === corpo.idDoacao)
      doacao.quantidadeDisponivel = Number((doacao.quantidadeDisponivel - corpo.quantidadeSolicitada).toFixed(2))
      recalcularStatusDoacao(doacao)
      Object.assign(novo, { dataReserva: new Date().toISOString().slice(0, 19), status: 'PENDENTE' })
    }

    novo[chave] = Math.max(0, ...lista.map((x) => x[chave])) + 1
    lista.push(novo)
    return enviar(201, publico(recurso, novo), { Location: `/${recurso}/${novo[chave]}` })
  }

  if (req.method === 'PUT' && id !== null) {
    if (!item) return enviar(404, { message: 'Registro não encontrado.' })
    const corpo = await lerCorpo(req)
    if (!corpo) return enviar(400, { message: 'JSON inválido.' })
        const statusAnterior = item.status
    Object.assign(item, corpo, { [chave]: id })

    if (
      recurso === 'reservas' &&
      ['PENDENTE', 'APROVADA'].includes(statusAnterior) &&
      ['RECUSADA', 'CANCELADA'].includes(item.status)
    ) {
      const doacao = db.doacoes.find((d) => d.idDoacao === item.idDoacao)
      if (doacao) {
        const devolvida = doacao.quantidadeDisponivel + item.quantidadeSolicitada
        doacao.quantidadeDisponivel = Number(Math.min(doacao.quantidadeTotal, devolvida).toFixed(2))
        recalcularStatusDoacao(doacao)
      }
    }
    return enviar(200, publico(recurso, item))
  }

  if (req.method === 'DELETE' && id !== null) {
    if (!item) return enviar(404, { message: 'Registro não encontrado.' })
    if (recurso === 'doacoes' && db.reservas.some((r) => r.idDoacao === id))
      return enviar(409, { message: 'Não é possível remover uma doação que possui reservas.' })
    lista.splice(lista.indexOf(item), 1)
    return enviar(204)
  }

  return enviar(405, { message: 'Método não suportado.' })
}).listen(PORT, () => console.log(`Mock da API rodando em http://localhost:${PORT}`))