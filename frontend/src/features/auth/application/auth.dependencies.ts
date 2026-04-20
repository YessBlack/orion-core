import { IAuthRepository } from "../domain/IAuthRepository"
import { ITokenStorage } from "../domain/ITokenStorage"

export type AuthDependencies = {
  authRepository: IAuthRepository
  tokenStorage: ITokenStorage
}
