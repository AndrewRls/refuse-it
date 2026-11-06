// Servidor falso SOMENTE para desenvolvimento. Não faz parte da entrega.
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'

const PORT = 8080
const db = JSON.parse(readFileSync(new URL('./db.json', import.meta.url), 'utf-8'))

const campoId = {
  doacoes: 'idDoacao',
  alimentos: 'idAlimento',
  estabelecimentos: 'idEstabelecimento',
  reservas: 'idReserva',
}
for (const recurso of Object.keys(campoId)) db[recurso] ??= []

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
  const chave = campoId[recurso]
  if (!chave) return enviar(404, { message: 'Recurso não encontrado.' })

  const lista = db[recurso]
  const id = idTxt === undefined ? null : Number(idTxt)
  const item = id === null ? null : lista.find((x) => x[chave] === id)

  if (req.method === 'GET') {
    if (id === null) return enviar(200, lista)
    return item ? enviar(200, item) : enviar(404, { message: 'Registro não encontrado.' })
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
    novo[chave] = Math.max(0, ...lista.map((x) => x[chave])) + 1
    lista.push(novo)
    return enviar(201, novo, { Location: `/${recurso}/${novo[chave]}` })
  }

  if (req.method === 'PUT' && id !== null) {
    if (!item) return enviar(404, { message: 'Registro não encontrado.' })
    const corpo = await lerCorpo(req)
    if (!corpo) return enviar(400, { message: 'JSON inválido.' })
    Object.assign(item, corpo, { [chave]: id })
    return enviar(200, item)
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