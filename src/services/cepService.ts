import { apenasDigitos } from '../utils/forms'

interface ViaCepResposta {
  logradouro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

export interface EnderecoCep {
  endereco: string
  cidade: string
  estado: string
}

export async function buscarCep(cep: string): Promise<EnderecoCep | null> {
  const digitos = apenasDigitos(cep)
  if (digitos.length !== 8) return null

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`)
    if (!resposta.ok) return null
    const dados = (await resposta.json()) as ViaCepResposta
    if (dados.erro) return null
    return { endereco: dados.logradouro ?? '', cidade: dados.localidade ?? '', estado: dados.uf ?? '' }
  } catch {
    return null
  }
}