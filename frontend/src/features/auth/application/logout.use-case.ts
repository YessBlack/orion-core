import { AuthDependencies } from "./auth.dependencies"

export const logoutUseCase = async (deps: AuthDependencies): Promise<void> => {
  try {
    await deps.authRepository.logout()
  } finally {
    await deps.tokenStorage.clear()
  }
}
