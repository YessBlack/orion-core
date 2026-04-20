export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface LoginResult {
  accessToken: string
  tokenType: string
  expiresIn?: number
  expiresAt?: string
  refreshTokenExpiresIn?: number
  refreshTokenExpiresAt?: string
  user: AuthUser
}

export type RefreshResult = Omit<LoginResult, "user">
