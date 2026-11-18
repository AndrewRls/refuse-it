/** Tipos de conta da API Java */
export type TipoConta = 'PESSOA_FISICA' | 'EMPRESA' | 'ONG'

export type UnidadeMedida = 'KG' | 'GRAMA' | 'LITRO' | 'ML' | 'UNIDADE'

export type StatusDoacao = 'CANCELADA' | 'DISPONIVEL' | 'ESGOTADA' | 'EXPIRADA' | 'PARCIALMENTE_RESERVADA'

/** Conta que está usando o sistema (é o que a API de login devolve). */
export interface Conta {
  idUsuario: number
  nome: string
  tipo: TipoConta
}

/** Sessão guardada no navegador. */
export type Sessao = Conta

export interface Alimento {
  idAlimento: number
  nome: string
  categoria: string
  descricao?: string
  unidadeMedida: UnidadeMedida
}

export interface Doacao {
  idDoacao: number
  idEstabelecimento: number | null
  idPessoaFisica?: number | null
  nomeDoador?: string
  cidade?: string
  estado?: string
  idAlimento: number
  quantidadeTotal: number
  quantidadeDisponivel: number
  dataPublicacao: string
  dataValidade: string
  dataLimiteRetirada: string
  condicaoArmazenamento?: string
  status: StatusDoacao
}

/** Doação já com os dados do alimento. */
export interface DoacaoView extends Doacao {
  alimento?: Alimento
}

/** Reserva feita por uma ONG, já normalizada a partir do que a API devolve. */
export interface MinhaReserva {
  idReserva: number
  idDoacao: number
  quantidadeSolicitada: number
  status: string
  dataReserva?: string
  observacao?: string
  alimento?: Alimento
  nomeDoador?: string
}