import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { authDependencies } from "./app/dependencies/auth.dependencies"
import { router } from "./app/router/router"
import {
  configureAuthDependencies,
  useAuthStore,
} from "./features/auth/presentation/auth.store"

configureAuthDependencies(authDependencies)

export const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    void initializeAuth()
  }, [initializeAuth])

  return <RouterProvider router={router} />
}
