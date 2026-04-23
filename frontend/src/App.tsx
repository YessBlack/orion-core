import { useEffect } from "react"
import { useAuthStore } from "@/features/auth/presentation/auth.store"
import { configureAuthDependencies } from "@/features/auth/presentation/auth.store"
import { authDependencies } from "@/app/dependencies/auth.dependencies"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router/router"
import { ThemeToggle } from "./shared/components/theme-toggle"

export const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    configureAuthDependencies(authDependencies)
    initializeAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="fixed right-4 top-4 z-50">
      <ThemeToggle />
      </div>
      <RouterProvider router={router} />
    </>
  )
}
