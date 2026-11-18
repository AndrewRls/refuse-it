export type TipoUsuario = 'ADMIN' | 'DOADOR' | 'INSTITUICAO'
export type TipoConta = 'PESSOA_FISICA' | 'EMPRESA' | 'ONG'
export type StatusUsuario = 'ATIVO' | 'INATIVO'
export type CategoriaEstabelecimento = 'RESTAURANTE' | 'MERCADO' | 'PADARIA' | 'PRODUTOR' | 'OUTRO'
export type UnidadeMedida = 'KG' | 'GRAMA' | 'LITRO' | 'ML' | 'UNIDADE'
export type StatusDoacao = 'CANCELADA' | 'DISPONIVEL' | 'ESGOTADA' | 'EXPIRADA' | 'PARCIALMENTE_RESERVADA'
export type StatusReserva = 'APROVADA' | 'CANCELADA' | 'CONCLUIDA' | 'PENDENTE' | 'RECUSADA'
export type StatusEntrega = 'AGENDADA' | 'CONCLUIDA' | 'EM_ANDAMENTO' | 'NAO_REALIZADA'
export type TipoEntrega = 'RETIRADA' | 'ENTREGA'

export interface Usuario {
  idUsuario: number
  nome: string
  email: string
  telefone?: string
  tipoUsuario: TipoUsuario
  dataCadastro: string
  status: StatusUsuario
}

export interface Estabelecimento {
  idEstabelecimento: number
  idUsuario: number
  nomeFantasia: string
  razaoSocial: string
  cnpj: string
  categoria: CategoriaEstabelecimento
  endereco: string
  cidade: string
  estado: string
  cep: string
}

export interface Instituicao {
  idInstituicao: number
  idUsuario: number
  nome: string
  cnpj?: string
  tipoInstituicao: string
  descricao?: string
  endereco: string
  cidade: string
  estado: string
  cep: string
}

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

export interface Reserva {
  idReserva: number
  idDoacao: number
  idInstituicao: number
  quantidadeSolicitada: number
  dataReserva: string
  status: StatusReserva
  observacao?: string
}

export interface Entrega {
  idEntrega: number
  idReserva: number
  dataAgendada: string
  dataConclusao?: string
  tipoEntrega: TipoEntrega
  responsavel?: string
  status: StatusEntrega
}

/** Corpo do POST de doação (campos que o usuário preenche) */
export type NovaDoacao = Pick<
  Doacao,
  'idEstabelecimento' | 'idAlimento' | 'quantidadeTotal' |
  'dataValidade' | 'dataLimiteRetirada' | 'condicaoArmazenamento'
>

/** Doação já combinada com os dados do alimento e do estabelecimento */
export interface DoacaoView extends Doacao {
  alimento?: Alimento
  estabelecimento?: Estabelecimento
}

export interface Credenciais {
  email: string
  senha: string
}

/** Quem está logado (é o que a API de login devolve). */
export type Sessao = Conta

export type NovoUsuario = Pick<Usuario, 'nome' | 'email' | 'telefone' | 'tipoUsuario'> & { senha: string }
export type NovoEstabelecimento = Omit<Estabelecimento, 'idEstabelecimento'>
export type NovaInstituicao = Omit<Instituicao, 'idInstituicao'>
export type NovaReserva = Pick<Reserva, 'idDoacao' | 'idInstituicao' | 'quantidadeSolicitada' | 'observacao'>
export type NovaEntrega = Pick<Entrega, 'idReserva' | 'dataAgendada' | 'tipoEntrega' | 'responsavel'>

export interface PainelDados {
  doacoes: Doacao[]
  alimentos: Alimento[]
  estabelecimentos: Estabelecimento[]
  instituicoes: Instituicao[]
  reservas: Reserva[]
  entregas: Entrega[]
}

export interface ReservaView extends Reserva {
  doacao?: DoacaoView
  instituicao?: Instituicao
  entrega?: Entrega
}

export interface Indicadores {
  kgReaproveitados: number
  unidadesReaproveitadas: number
  doacoesAtivas: number
  reservasPendentes: number
  reservasAprovadas: number
  reservasConcluidas: number
}

/** Conta que está usando o sistema. */
export interface Conta {
  idUsuario: number
  nome: string
  tipo: TipoConta
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