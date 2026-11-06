import type { UnidadeMedida } from '../types'

/** Datas "YYYY-MM-DD" viram data local, sem o deslocamento de fuso. */
function parseLocal(iso: string): Date {
  const [ano, mes, dia] = iso.slice(0, 10).split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

export function formatarData(iso: string): string {
  return parseLocal(iso).toLocaleDateString('pt-BR')
}

export function diasParaVencer(iso: string): number {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  return Math.round((parseLocal(iso).getTime() - hoje.getTime()) / 86_400_000)
}

export function textoValidade(dias: number): string {
  if (dias < 0) return 'Vencido'
  if (dias === 0) return 'Vence hoje'
  if (dias === 1) return 'Vence amanhã'
  return `Vence em ${dias} dias`
}

const unidades: Record<UnidadeMedida, string> = {
  KG: 'kg',
  GRAMA: 'g',
  LITRO: 'L',
  ML: 'mL',
  UNIDADE: 'un',
}

export function formatarQuantidade(valor: number, unidade?: UnidadeMedida): string {
  const numero = valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
  return unidade ? `${numero} ${unidades[unidade]}` : numero
}

export function semAcento(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}