export function inputClasses(temErro: boolean): string {
  return `w-full rounded-2xl bg-white px-4 py-3 text-sm ring-1 transition focus:ring-2 focus:outline-none ${
    temErro ? 'ring-red-400 focus:ring-red-500' : 'ring-brand-100 focus:ring-brand-700'
  }`
}