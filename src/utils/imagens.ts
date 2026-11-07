const fotos = import.meta.glob<string>('../assets/fotos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
const rostos = import.meta.glob<string>('../assets/integrantes/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })

function achar(mapa: Record<string, string>, nome: string): string | undefined {
  const caminho = Object.keys(mapa).find((c) => c.split('/').pop()?.replace(/\.[^.]+$/, '') === nome)
  return caminho ? mapa[caminho] : undefined
}

export const foto = (nome: string) => achar(fotos, nome)
export const fotoIntegrante = (rm: string) => achar(rostos, rm)