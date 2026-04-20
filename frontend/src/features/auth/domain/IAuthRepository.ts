import { LoginResult, RefreshResult } from "./auth.types"

export interface IAuthRepository {
  login(email: string, password: string): Promise<LoginResult>
  refresh(): Promise<RefreshResult>
  logout(): Promise<void>
}
