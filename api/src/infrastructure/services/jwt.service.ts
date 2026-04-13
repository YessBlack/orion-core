import { TokenService } from '@/application/services/token.service.js'
import { AppErrorCode } from '@/application/shared/error-codes.js'
import { UserPermission } from '@/domain/entities/users/UserPermission.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'
import { AccessLevel } from '@/domain/shared/AccessLevel.js'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'supersecret'
const ACCESS_TOKEN_TTL_SECONDS = Number(process.env.JWT_ACCESS_TOKEN_TTL_SECONDS ?? 60 * 60 * 2)

export const jwtService: TokenService = {
  generate (payload): string {
    return jwt.sign(
      {
        sub: payload.userId,
        role: payload.role,
        apiAccessLevel: payload.apiAccessLevel,
        permissions: payload.permissions
      },
      SECRET,
      { expiresIn: ACCESS_TOKEN_TTL_SECONDS }
    )
  },

  validate (token: string) {
    try {
      const decoded = jwt.verify(token, SECRET) as {
        sub: string
        role: UserRole
        apiAccessLevel?: AccessLevel
        permissions?: UserPermission[]
      }

      if (!decoded.sub || !decoded.role) {
        throw new Error(AppErrorCode.InvalidToken)
      }

      return {
        userId: decoded.sub,
        role: decoded.role,
        apiAccessLevel: decoded.apiAccessLevel ?? AccessLevel.None,
        permissions: decoded.permissions ?? []
      }
    } catch {
      throw new Error(AppErrorCode.InvalidToken)
    }
  },

  getAccessTokenTtlSeconds () {
    return ACCESS_TOKEN_TTL_SECONDS
  }
}
