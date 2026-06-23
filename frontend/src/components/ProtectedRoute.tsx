import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.tsx'

export default function ProtectedRoute() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
