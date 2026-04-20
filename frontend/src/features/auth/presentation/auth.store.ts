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

const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1]
    if (!payloadBase64) return true

    const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"))
    const payload = JSON.parse(payloadJson) as { exp?: number }

    if (!payload.exp) return true

    const nowInSeconds = Math.floor(Date.now() / 1000)
    return payload.exp <= nowInSeconds
  } catch {
    return true
  }
}

export const configureAuthDependencies = (deps: AuthDependencies): void => {
  authDependencies = deps
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  initialized: false,

  initializeAuth: async () => {
    if (get().initialized) {
      return
    }

    const deps = getAuthDependencies()
    set({ isLoading: true })

    try {
      const accessToken = await deps.tokenStorage.getAccessToken()

      if (accessToken && !isTokenExpired(accessToken)) {
        set({ isAuthenticated: true })
        return
      }

      if (accessToken && !isTokenExpired(accessToken)) {
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
    await loginUseCase(input, deps)
    set({ isAuthenticated: true })
  },

  logout: async () => {
    const deps = getAuthDependencies()
    await logoutUseCase(deps)
    set({ isAuthenticated: false })
  },
}))
