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

export function rotuloUnidade(unidade: UnidadeMedida): string {
  return unidades[unidade]
}

export function formatarQuantidade(valor: number, unidade?: UnidadeMedida): string {
  const numero = valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
  return unidade ? `${numero} ${unidades[unidade]}` : numero
}

export function semAcento(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

/** Data local no formato AAAA-MM-DD (valor dos inputs type="date"). */
export function dataISO(offsetDias = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDias)
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

export function formatarDataHora(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

const pad = (n: number) => String(n).padStart(2, '0')

function localISO(d: Date, comSegundos: boolean): string {
  const base = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  return comSegundos ? `${base}:${pad(d.getSeconds())}` : base
}

/** Valor para inputs type="datetime-local" (AAAA-MM-DDTHH:mm), em horário local. */
export const dataHoraInput = (offsetMinutos = 0) => localISO(new Date(Date.now() + offsetMinutos * 60_000), false)

/** Agora em horário local, sem fuso (AAAA-MM-DDTHH:mm:ss), como as colunas TIMESTAMP. */
export const agoraISO = () => localISO(new Date(), true)

const fatorKg: Record<UnidadeMedida, number | null> = {
  KG: 1,
  GRAMA: 0.001,
  LITRO: 1, // simplificação: 1 L ≈ 1 kg
  ML: 0.001,
  UNIDADE: null,
}

/** Peso estimado em kg, ou null quando o item é contado por unidade. */
export function pesoEmKg(quantidade: number, unidade: UnidadeMedida): number | null {
  const fator = fatorKg[unidade]
  return fator === null ? null : quantidade * fator
}