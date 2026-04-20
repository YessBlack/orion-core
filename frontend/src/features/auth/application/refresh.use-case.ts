import { RefreshResult } from "../domain/auth.types"
import { AuthDependencies } from "./auth.dependencies"

export const refreshUseCase = async (
  deps: AuthDependencies
): Promise<RefreshResult> => {
  const result = await deps.authRepository.refresh()
  await deps.tokenStorage.save(result.accessToken)
  return result
}
