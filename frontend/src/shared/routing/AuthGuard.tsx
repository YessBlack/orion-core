import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/features/auth/presentation/auth.store"

export default function AuthGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)

  if (isLoading) {
    return <div>Cargando sesion...</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
