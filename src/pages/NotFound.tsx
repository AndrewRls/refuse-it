import { SearchX } from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <EmptyState
        icon={SearchX}
        titulo="Página não encontrada"
        texto="O endereço que você digitou não existe ou foi movido."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button to="/">Ir para o início</Button>
            <Button to="/doacoes" variant="secondary">Ver doações</Button>
          </div>
        }
      />
    </section>
  )
}