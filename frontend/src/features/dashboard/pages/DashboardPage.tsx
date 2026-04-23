import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/presentation/auth.store";

export default function DashboardPage() {
  const logout = useAuthStore(state => state.logout)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div>
      <Button onClick={handleLogout} variant={'link'}>
        Cerrar Sesion
      </Button>
    </div>
  )
}
