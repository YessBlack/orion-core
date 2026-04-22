import { ITokenService } from '@/application/services/token.service.js'
import { UserPermission } from '@/domain/entities/users/UserPermission.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'
import { createAppError } from '@/application/shared/AppError.js'
import { AppErrorCode } from '@/application/shared/AppErrorCode.js'
import crypto, { randomUUID } from 'node:crypto'
import jwt from 'jsonwebtoken'

const readRequiredEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error('Missing required environment variable: ' + name)
  }
  return value
}

const readPositiveIntEnv = (name: string, defaultValue: number): number => {
  const raw = process.env[name]
  if (!raw) return defaultValue
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
    throw new Error('Invalid environment variable ' + name + ': must be a positive integer')
  }
  return parsed
}

const ACCESS_SECRET = readRequiredEnv('JWT_SECRET')
const REFRESH_SECRET = readRequiredEnv('JWT_REFRESH_SECRET')
const REFRESH_TOKEN_PEPPER = readRequiredEnv('REFRESH_TOKEN_PEPPER')

if (ACCESS_SECRET === REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different')
}

const ACCESS_TOKEN_TTL_SECONDS = readPositiveIntEnv('JWT_ACCESS_TOKEN_TTL_SECONDS', 60 * 60 * 2)
const REFRESH_TOKEN_TTL_SECONDS = readPositiveIntEnv('JWT_REFRESH_TOKEN_TTL_SECONDS', 60 * 60 * 24 * 7)

export const jwtService: ITokenService = {
  generateAccessToken (payload) {
    return jwt.sign(
      {
        sub: payload.userId,
        role: payload.role,
        permissions: payload.permissions,
        tokenType: 'access'
      },
      ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL_SECONDS }
    )
  },

  generateRefreshToken (payload) {
    return jwt.sign(
      {
        sub: payload.userId,
        role: payload.role,
        permissions: payload.permissions,
        tokenType: 'refresh',
        jti: randomUUID()
      },
      REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_TTL_SECONDS }
    )
  },

  validateAccessToken (token) {
    try {
      const decoded = jwt.verify(token, ACCESS_SECRET) as {
        sub: string
        role: UserRole
        permissions?: UserPermission[]
        tokenType?: string
      }

      if (!decoded.sub || !decoded.role || decoded.tokenType !== 'access') {
        throw createAppError(AppErrorCode.InvalidToken)
      }

      return {
        userId: decoded.sub,
        role: decoded.role,
        permissions: decoded.permissions ?? []
      }
    } catch {
      throw createAppError(AppErrorCode.InvalidToken)
    }
  },

  validateRefreshToken (token) {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET) as {
        sub: string
        role: UserRole
        permissions?: UserPermission[]
        tokenType?: string
      }

      if (!decoded.sub || !decoded.role || decoded.tokenType !== 'refresh') {
        throw createAppError(AppErrorCode.InvalidToken)
      }

      return {
        userId: decoded.sub,
        role: decoded.role,
        permissions: decoded.permissions ?? []
      }
    } catch {
      throw createAppError(AppErrorCode.InvalidToken)
    }
  },

  getAccessTokenTtlSeconds () {
    return ACCESS_TOKEN_TTL_SECONDS
  },

  getRefreshTokenTtlSeconds () {
    return REFRESH_TOKEN_TTL_SECONDS
  },

  async hashRefreshToken (token) {
    return crypto
      .createHash('sha256')
      .update(token + '.' + REFRESH_TOKEN_PEPPER)
      .digest('hex')
  }
}
