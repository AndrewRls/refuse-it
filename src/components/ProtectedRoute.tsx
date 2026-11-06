import { Lock } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import EmptyState from './EmptyState'
import Button from './Button'
import { useAuth } from '../hooks/useAuth'
import type { TipoUsuario } from '../types'

export default function ProtectedRoute({ roles }: { roles?: TipoUsuario[] }) {
  const { sessao } = useAuth()
  const location = useLocation()

  if (!sessao) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(sessao.usuario.tipoUsuario)) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <EmptyState
          icon={Lock}
          titulo="Área restrita"
          texto="Esta página não está disponível para o seu tipo de conta."
          action={<Button to="/">Voltar ao início</Button>}
        />
      </section>
    )
  }

  return <Outlet />
}