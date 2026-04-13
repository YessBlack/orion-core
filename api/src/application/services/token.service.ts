import { UserPermission } from '@/domain/entities/users/UserPermission.js'
import { AccessLevel } from '@/domain/shared/AccessLevel.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'

export type AuthTokenPayload = {
  userId: string
  role: UserRole
  apiAccessLevel: AccessLevel
  permissions: UserPermission[]
}

export interface TokenService {
  generate(payload: AuthTokenPayload): string
  validate(token: string): AuthTokenPayload
  getAccessTokenTtlSeconds(): number
}
