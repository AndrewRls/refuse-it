export const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export const apenasDigitos = (texto: string) => texto.replace(/\D/g, '')

/** Preenche o padrão (# = dígito) com os números e descarta o que sobrar. */
function aplicar(digitos: string, padrao: string): string {
  let i = 0
  return padrao.replace(/#/g, () => digitos[i++] ?? '').replace(/[^\d]+$/, '')
}

export const mascararCNPJ = (t: string) => aplicar(apenasDigitos(t).slice(0, 14), '##.###.###/####-##')
export const mascararCEP = (t: string) => aplicar(apenasDigitos(t).slice(0, 8), '#####-###')

export function mascararTelefone(t: string): string {
  const d = apenasDigitos(t).slice(0, 11)
  return aplicar(d, d.length > 10 ? '(##) #####-####' : '(##) ####-####')
}

export const emailValido = (e: string) => /^\S+@\S+\.\S+$/.test(e)

/** Confere os dois dígitos verificadores do CNPJ. */
export function cnpjValido(valor: string): boolean {
  const c = apenasDigitos(valor)
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false

  const digito = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const soma = base.split('').reduce((acc, d, i) => acc + Number(d) * pesos[i], 0)
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const d1 = digito(c.slice(0, 12))
  const d2 = digito(c.slice(0, 12) + d1)
  return c.endsWith(`${d1}${d2}`)
}

export const mascararData = (t: string) => aplicar(apenasDigitos(t).slice(0, 8), '##/##/####')
export const mascararHora = (t: string) => aplicar(apenasDigitos(t).slice(0, 4), '##:##')

export const horaValida = (h: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(h)

/** "07/11/2026" vira "2026-11-07". Devolve null se não for uma data real (ex.: 31/02). */
export function dataTextoParaISO(texto: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto)
  if (!m) return null

  const [, d, mes, a] = m
  const data = new Date(Number(a), Number(mes) - 1, Number(d))
  const real =
    data.getFullYear() === Number(a) && data.getMonth() === Number(mes) - 1 && data.getDate() === Number(d)

  return real ? `${a}-${mes}-${d}` : null
}

/** "2026-11-07" vira "07/11/2026". */
export function isoParaTexto(iso: string): string {
  const [a, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${a}`
}