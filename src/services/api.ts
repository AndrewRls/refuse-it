const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function mensagemPadrao(status: number): string {
  if (status === 400) return 'Os dados enviados não foram aceitos. Confira os campos.'
  if (status === 401) return 'Não autorizado.'
  if (status === 404) return 'Não encontrado.'
  if (status === 409) return 'Essa operação conflita com o estado atual.'
  if (status >= 500) return 'O servidor encontrou um problema. Tente novamente em instantes.'
  return `Erro ${status}`
}

async function lerCorpo(resposta: Response): Promise<unknown> {
  const texto = await resposta.text()
  if (!texto) return undefined
  try {
    return JSON.parse(texto)
  } catch {
    return texto
  }
}

function extrairMensagem(corpo: unknown, status: number): string {
  if (corpo && typeof corpo === 'object') {
    const objeto = corpo as Record<string, unknown>
    for (const chave of ['message', 'mensagem', 'erro']) {
      const valor = objeto[chave]
      if (typeof valor === 'string' && valor.trim()) return valor
    }
  }
  if (typeof corpo === 'string' && corpo.length > 0 && corpo.length < 200 && !corpo.trimStart().startsWith('<')) {
    return corpo
  }
  return mensagemPadrao(status)
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { headers, ...rest } = options

  let resposta: Response
  try {
    resposta = await fetch(`${BASE_URL}${path}`, {
      headers: { ...(rest.body ? { 'Content-Type': 'application/json' } : {}), ...headers },
      ...rest,
    })
  } catch {
    throw new ApiError(
      0,
      'Não foi possível conectar ao servidor. Se a API estiver acordando, aguarde cerca de 1 minuto e tente de novo.',
    )
  }

  const corpo = await lerCorpo(resposta)
  if (!resposta.ok) throw new ApiError(resposta.status, extrairMensagem(corpo, resposta.status))

  return corpo as T // fica undefined quando a resposta não tem corpo
}