import { useEffect } from "react"
import { useAuthStore } from "@/features/auth/presentation/auth.store"
import { configureAuthDependencies } from "@/features/auth/presentation/auth.store"
import { authDependencies } from "@/app/dependencies/auth.dependencies"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router/router"

export const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    configureAuthDependencies(authDependencies)
    initializeAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <RouterProvider router={router} />
}
