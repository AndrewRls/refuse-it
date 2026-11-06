export default function Spinner({ texto = 'Carregando...' }: { texto?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-4 py-20 text-brand-700">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />
      <p className="text-sm font-semibold">{texto}</p>
    </div>
  )
}