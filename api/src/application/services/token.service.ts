import { UserPermission } from '@/domain/entities/users/UserPermission.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'

export type AuthTokenPayload = {
  userId: string
  role: UserRole
  permissions: UserPermission[]
}

export interface TokenService {
  generateAccessToken(payload: AuthTokenPayload): string
  generateRefreshToken(payload: AuthTokenPayload): string
  validateAccessToken(token: string): AuthTokenPayload
  validateRefreshToken(token: string): AuthTokenPayload
  getAccessTokenTtlSeconds(): number
  getRefreshTokenTtlSeconds(): number
}
