export enum UserRole {
  Admin = 'admin',
  Seller = 'seller'
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
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
