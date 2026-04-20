import { AuthDependencies } from "@/features/auth/application/auth.dependencies"
import { AuthApiRepository } from "@/features/auth/infrastructure/AuthApiRepository"
import { LocalTokenStorage } from "@/features/auth/infrastructure/LocalTokenStorage"

export const authDependencies: AuthDependencies = {
  authRepository: AuthApiRepository,
  tokenStorage: LocalTokenStorage,
}
