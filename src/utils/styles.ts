export function inputClasses(temErro: boolean): string {
  return `w-full rounded-2xl bg-white px-4 py-3 text-sm ring-1 transition focus:ring-2 focus:outline-none ${
    temErro ? 'ring-red-400 focus:ring-red-500' : 'ring-brand-100 focus:ring-brand-700'
  }`
}
const botao =
  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-50'

export const botaoPrimario = `${botao} bg-brand-700 text-white hover:bg-brand-900`
export const botaoNeutro = `${botao} bg-white text-brand-900 ring-1 ring-brand-100 hover:bg-brand-50`
export const botaoPerigo = `${botao} bg-white text-red-700 ring-1 ring-red-200 hover:bg-red-50`