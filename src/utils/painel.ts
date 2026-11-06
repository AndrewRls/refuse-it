import type { Doacao, DoacaoView, Indicadores, PainelDados, Reserva, ReservaView } from '../types'
import { diasParaVencer, pesoEmKg } from './format'

export function montarDoacoes(dados: PainelDados): DoacaoView[] {
  const alimentos = new Map(dados.alimentos.map((a) => [a.idAlimento, a]))
  const estabelecimentos = new Map(dados.estabelecimentos.map((e) => [e.idEstabelecimento, e]))
  return dados.doacoes.map((d) => ({
    ...d,
    alimento: alimentos.get(d.idAlimento),
    estabelecimento: estabelecimentos.get(d.idEstabelecimento),
  }))
}

export function montarReservas(dados: PainelDados, doacoes: DoacaoView[]): ReservaView[] {
  const doacaoPorId = new Map(doacoes.map((d) => [d.idDoacao, d]))
  const instituicoes = new Map(dados.instituicoes.map((i) => [i.idInstituicao, i]))
  const entregaPorReserva = new Map(dados.entregas.map((e) => [e.idReserva, e]))
  return dados.reservas.map((r) => ({
    ...r,
    doacao: doacaoPorId.get(r.idDoacao),
    instituicao: instituicoes.get(r.idInstituicao),
    entrega: entregaPorReserva.get(r.idReserva),
  }))
}

/** Remove os dados agregados da tela antes de enviar num PUT. */
export function paraDoacao(d: DoacaoView): Doacao {
  return {
    idDoacao: d.idDoacao,
    idEstabelecimento: d.idEstabelecimento,
    idAlimento: d.idAlimento,
    quantidadeTotal: d.quantidadeTotal,
    quantidadeDisponivel: d.quantidadeDisponivel,
    dataPublicacao: d.dataPublicacao,
    dataValidade: d.dataValidade,
    dataLimiteRetirada: d.dataLimiteRetirada,
    condicaoArmazenamento: d.condicaoArmazenamento,
    status: d.status,
  }
}

export function paraReserva(r: ReservaView): Reserva {
  return {
    idReserva: r.idReserva,
    idDoacao: r.idDoacao,
    idInstituicao: r.idInstituicao,
    quantidadeSolicitada: r.quantidadeSolicitada,
    dataReserva: r.dataReserva,
    status: r.status,
    observacao: r.observacao,
  }
}

export function calcularIndicadores(doacoes: DoacaoView[], reservas: ReservaView[]): Indicadores {
  let kg = 0
  let unidades = 0

  for (const r of reservas) {
    if (r.status !== 'CONCLUIDA') continue
    const unidade = r.doacao?.alimento?.unidadeMedida
    if (!unidade) continue
    const peso = pesoEmKg(r.quantidadeSolicitada, unidade)
    if (peso === null) unidades += r.quantidadeSolicitada
    else kg += peso
  }

  const contar = (status: Reserva['status']) => reservas.filter((r) => r.status === status).length

  return {
    kgReaproveitados: kg,
    unidadesReaproveitadas: unidades,
    doacoesAtivas: doacoes.filter(
      (d) => (d.status === 'DISPONIVEL' || d.status === 'PARCIALMENTE_RESERVADA') && diasParaVencer(d.dataValidade) >= 0,
    ).length,
    reservasPendentes: contar('PENDENTE'),
    reservasAprovadas: contar('APROVADA'),
    reservasConcluidas: contar('CONCLUIDA'),
  }
}