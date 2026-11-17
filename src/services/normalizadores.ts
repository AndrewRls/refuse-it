import type { Alimento, DoacaoView, MinhaReserva, StatusDoacao, UnidadeMedida } from '../types'

/** Formato que a API Java devolve para um alimento. */
export interface AlimentoApi {
  idAlimento: number
  nome: string
  categoria?: string | null
  descricao?: string | null
  unidadeMedida?: string | null
}

/** Formato que a API Java devolve para uma doação. */
export interface DoacaoApi {
  idDoacao: number
  idEstabelecimento?: number | null
  idPessoaFisica?: number | null
  alimento?: AlimentoApi | null
  nomeDoador?: string | null
  cidade?: string | null
  estado?: string | null
  quantidadeTotal: number
  quantidadeDisponivel: number
  dataPublicacao?: string | null
  dataValidade: string
  dataLimiteRetirada: string
  condicaoArmazenamento?: string | null
  status?: string | null
}

const UNIDADES: UnidadeMedida[] = ['KG', 'GRAMA', 'LITRO', 'ML', 'UNIDADE']
const STATUS: StatusDoacao[] = ['CANCELADA', 'DISPONIVEL', 'ESGOTADA', 'EXPIRADA', 'PARCIALMENTE_RESERVADA']

export function normalizarAlimento(a: AlimentoApi): Alimento {
  const unidade = String(a.unidadeMedida ?? '').toUpperCase() as UnidadeMedida
  return {
    idAlimento: a.idAlimento,
    nome: a.nome,
    categoria: a.categoria ?? 'Outros',
    descricao: a.descricao ?? undefined,
    unidadeMedida: UNIDADES.includes(unidade) ? unidade : 'UNIDADE',
  }
}

export function normalizarDoacao(d: DoacaoApi): DoacaoView {
  const total = Number(d.quantidadeTotal)
  const disponivel = Number(d.quantidadeDisponivel)

  // Se a API não mandar o status, ele é deduzido das quantidades.
  const informado = String(d.status ?? '').toUpperCase() as StatusDoacao
  let status: StatusDoacao = STATUS.includes(informado) ? informado : 'DISPONIVEL'
  if (!STATUS.includes(informado)) {
    if (disponivel <= 0) status = 'ESGOTADA'
    else if (disponivel < total) status = 'PARCIALMENTE_RESERVADA'
  }

  return {
    idDoacao: d.idDoacao,
    idEstabelecimento: d.idEstabelecimento ?? null,
    idPessoaFisica: d.idPessoaFisica ?? null,
    idAlimento: d.alimento?.idAlimento ?? 0,
    nomeDoador: d.nomeDoador ?? undefined,
    cidade: d.cidade ?? undefined,
    estado: d.estado ?? undefined,
    quantidadeTotal: total,
    quantidadeDisponivel: disponivel,
    // A API manda microssegundos (2026-11-15T18:12:31.716948): cortamos em segundos.
    dataPublicacao: d.dataPublicacao ? d.dataPublicacao.slice(0, 19) : `${d.dataLimiteRetirada}T00:00:00`,
    dataValidade: d.dataValidade,
    dataLimiteRetirada: d.dataLimiteRetirada,
    condicaoArmazenamento: d.condicaoArmazenamento ?? undefined,
    status,
    alimento: d.alimento ? normalizarAlimento(d.alimento) : undefined,
  }
}

/** Formato (provável) que a API devolve para uma reserva. Todos os campos extras são opcionais. */
export interface ReservaApi {
  idReserva: number
  idDoacao: number
  quantidadeSolicitada: number
  status?: string | null
  dataReserva?: string | null
  observacao?: string | null
  alimento?: AlimentoApi | null
  nomeDoador?: string | null
  doacao?: DoacaoApi | null
}

export function normalizarReserva(r: ReservaApi): MinhaReserva {
  const alimentoApi = r.alimento ?? r.doacao?.alimento ?? null
  return {
    idReserva: r.idReserva,
    idDoacao: r.idDoacao ?? r.doacao?.idDoacao ?? 0,
    quantidadeSolicitada: Number(r.quantidadeSolicitada),
    status: String(r.status ?? '').toUpperCase(),
    dataReserva: r.dataReserva ? r.dataReserva.slice(0, 19) : undefined,
    observacao: r.observacao ?? undefined,
    alimento: alimentoApi ? normalizarAlimento(alimentoApi) : undefined,
    nomeDoador: r.nomeDoador ?? r.doacao?.nomeDoador ?? undefined,
  }
}