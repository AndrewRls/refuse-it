const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { headers, ...rest } = options

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...headers },
      ...rest,
    })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor. Tente novamente em instantes.')
  }

  if (!response.ok) {
    let message = `Erro ${response.status}`
    try {
      const body = await response.json()
      message = body.message ?? body.erro ?? message
    } catch { /* corpo sem JSON */ }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}