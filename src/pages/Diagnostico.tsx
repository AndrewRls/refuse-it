import { useState } from 'react'
import type { FormEvent } from 'react'
import { ClipboardCheck, ClipboardCopy, LoaderCircle, Play } from 'lucide-react'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { inputClasses } from '../utils/styles'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const LIMITE = 2000

interface Resultado {
  titulo: string
  metodo: string
  caminho: string
  status: number | null
  ms: number
  corpo: string
  json?: unknown
}

type Teste = [string, string, string, unknown?]

function formatar(texto: string): string {
  let saida = texto
  try {
    saida = JSON.stringify(JSON.parse(texto), null, 2)
  } catch {
    /* não é JSON: mostra como veio */
  }
  if (!saida) return '(corpo vazio)'
  return saida.length > LIMITE ? `${saida.slice(0, LIMITE)}\n... (cortado)` : saida
}

async function chamar(titulo: string, metodo: string, caminho: string, corpo?: unknown): Promise<Resultado> {
  const inicio = performance.now()
  const controle = new AbortController()
  const timer = setTimeout(() => controle.abort(), 90_000)
  const ms = () => Math.round(performance.now() - inicio)

  try {
    const resposta = await fetch(`${BASE}${caminho}`, {
      method: metodo,
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: controle.signal,
    })
    const texto = await resposta.text()
    let json: unknown
    try {
      json = JSON.parse(texto)
    } catch {
      json = undefined
    }
    return { titulo, metodo, caminho, status: resposta.status, ms: ms(), corpo: formatar(texto), json }
  } catch (e) {
    const abortou = e instanceof DOMException && e.name === 'AbortError'
    const motivo = abortou
      ? 'Sem resposta em 90 s (a API pode estar acordando; tente de novo).'
      : 'Falha ao conectar. Causas comuns: CORS não liberado para este endereço, API fora do ar ou URL errada.'
    return { titulo, metodo, caminho, status: null, ms: ms(), corpo: motivo }
  } finally {
    clearTimeout(timer)
  }
}

const basicos: Teste[] = [
  ['Alimentos (lista)', 'GET', '/alimentos'],
  ['Doações disponíveis', 'GET', '/doacoes/disponiveis'],
  ['Vendas disponíveis', 'GET', '/vendas/disponiveis'],
  ['Erro de validação (como a API responde)', 'GET', '/alimentos/0'],
  ['Login com dados falsos (espera 401)', 'POST', '/usuarios/login', { email: 'teste@teste.com', senha: 'x', tipo: 'ONG' }],
]

function corStatus(status: number | null): string {
  if (status === null) return 'bg-red-100 text-red-800'
  if (status < 300) return 'bg-brand-100 text-brand-900'
  if (status < 500) return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-800'
}

function montarRelatorio(resultados: Resultado[]): string {
  const linhas = resultados.map(
    (r) => `### ${r.titulo}\n${r.metodo} ${r.caminho} -> ${r.status ?? 'SEM RESPOSTA'} (${r.ms} ms)\n${r.corpo}\n`,
  )
  return [`API: ${BASE}`, `Origem: ${window.location.origin}`, '', ...linhas].join('\n')
}

export default function Diagnostico() {
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [rodando, setRodando] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [tipo, setTipo] = useState('ONG')

  async function executar(testes: Teste[]) {
    for (const [titulo, metodo, caminho, corpo] of testes) {
      const resultado = await chamar(titulo, metodo, caminho, corpo)
      setResultados((atual) => [...atual, resultado])
    }
  }

  async function rodarBasicos() {
    setRodando(true)
    setCopiado(false)
    await executar(basicos)
    setRodando(false)
  }

  async function testarLogin(ev: FormEvent) {
    ev.preventDefault()
    setRodando(true)
    setCopiado(false)

    const login = await chamar('Login', 'POST', '/usuarios/login', { email: email.trim(), senha, tipo })
    setResultados((atual) => [...atual, login])

    const dados = login.json as { idUsuario?: number } | undefined
    if (login.status === 200 && dados?.idUsuario) {
      const id = dados.idUsuario
      const extras: Teste[] = [['Meus dados', 'GET', `/usuarios/${id}?tipo=${tipo}`]]

      if (tipo === 'PESSOA_FISICA' || tipo === 'EMPRESA') {
        extras.push(['Minhas doações', 'GET', `/doacoes/usuario/${id}`])
      }
      if (tipo === 'EMPRESA') {
        extras.push(['Meus anúncios de venda', 'GET', `/vendas/usuario/${id}`])
        extras.push(['Compras recebidas', 'GET', `/compras/empresa/${id}`])
      }
      if (tipo === 'ONG') {
        extras.push(['Minhas reservas', 'GET', `/reservas/usuario/${id}`])
        extras.push(['Minhas compras', 'GET', `/compras/ong/${id}`])
      }
      await executar(extras)
    }
    setRodando(false)
  }

  async function copiar() {
    await navigator.clipboard.writeText(montarRelatorio(resultados))
    setCopiado(true)
  }

  return (
    <>
      <PageHeader
        titulo="Diagnóstico da API"
        descricao="Página de uso interno. Mostra o que a API responde para este navegador. Será removida antes da entrega."
      />

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="rounded-lg bg-brand-50 p-4 text-sm text-ink/80 ring-1 ring-brand-100">
          API testada: <strong className="break-all">{BASE}</strong>
          <br />A primeira chamada pode levar até 1 minuto se a API estiver dormindo.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => void rodarBasicos()} disabled={rodando}>
            {rodando ? <LoaderCircle size={18} className="animate-spin" /> : <Play size={18} />} Rodar testes básicos
          </Button>
          <Button variant="secondary" onClick={() => setResultados([])} disabled={rodando}>
            Limpar
          </Button>
          {resultados.length > 0 && (
            <Button variant="secondary" onClick={() => void copiar()}>
              {copiado ? <ClipboardCheck size={18} /> : <ClipboardCopy size={18} />} {copiado ? 'Copiado!' : 'Copiar relatório'}
            </Button>
          )}
        </div>

        <form onSubmit={(ev) => void testarLogin(ev)} className="mt-8 rounded-lg bg-white p-5 ring-1 ring-brand-100">
          <h2 className="text-lg">Testar login e as rotas do usuário</h2>
          <p className="mt-1 text-xs text-ink/60">
            Use uma conta que já existe na API. A senha só é enviada para a API e não entra no relatório.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <input
              type="email"
              placeholder="E-mail"
              aria-label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses(false)}
            />
            <input
              type="password"
              placeholder="Senha"
              aria-label="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={inputClasses(false)}
            />
            <select aria-label="Tipo de conta" value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClasses(false)}>
              <option value="ONG">ONG</option>
              <option value="EMPRESA">Empresa</option>
              <option value="PESSOA_FISICA">Pessoa física</option>
            </select>
          </div>
          <div className="mt-4">
            <Button type="submit" disabled={rodando || !email || !senha}>
              Entrar e testar
            </Button>
          </div>
        </form>

        <div className="mt-8 space-y-4">
          {resultados.map((r, i) => (
            <article key={`${r.caminho}-${i}`} className="rounded-lg bg-white p-5 ring-1 ring-brand-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base">{r.titulo}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${corStatus(r.status)}`}>
                  {r.status ?? 'sem resposta'} · {r.ms} ms
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-ink/60">
                {r.metodo} {r.caminho}
              </p>
              <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-ink p-4 text-xs text-white">{r.corpo}</pre>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}