import { create } from "zustand"
import { AuthDependencies } from "../application/auth.dependencies"
import { LoginInput } from "../application/login.input"
import { loginUseCase } from "../application/login.use-case"
import { logoutUseCase } from "../application/logout.use-case"
import { refreshUseCase } from "../application/refresh.use-case"

type AuthStoreState = {
  isAuthenticated: boolean
  isLoading: boolean
  initialized: boolean
  initializeAuth: () => Promise<void>
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
}

let authDependencies: AuthDependencies | null = null


const getAuthDependencies = (): AuthDependencies => {
  if (!authDependencies) {
    throw new Error("Auth dependencies are not configured")
  }

  return authDependencies
}

export const configureAuthDependencies = (deps: AuthDependencies): void => {
  authDependencies = deps
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  initialized: false,

  initializeAuth: async () => {
    if (get().initialized) return

    const deps = getAuthDependencies()
    set({ isLoading: true })

    try {
      const accessToken = deps.tokenStorage.getAccessToken()

      if (!accessToken) {
        set({ isAuthenticated: false })
        return
      }

      if (accessToken && !deps.tokenStorage.isTokenExpired(accessToken)) {
        set({ isAuthenticated: true })
        return
      }

      try {
        await refreshUseCase(deps)
        set({ isAuthenticated: true })
      } catch {
        await deps.tokenStorage.clear()
        set({ isAuthenticated: false })
      }
    } finally {
      set({ isLoading: false, initialized: true })
    }
  },

  login: async (input: LoginInput) => {
    const deps = getAuthDependencies()
    const result = await loginUseCase(input, deps)
    await deps.tokenStorage.save(result.accessToken)
    set({ isAuthenticated: true })
  },

  logout: async () => {
    const deps = getAuthDependencies()
    await logoutUseCase(deps)
    set({ isAuthenticated: false })
  },
}))
