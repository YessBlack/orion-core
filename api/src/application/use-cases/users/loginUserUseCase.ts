import { ITokenService } from '@/application/services/token.service.js'
import { IUserRepository } from '@/domain/repositories/users/IUserRepository.js'
import { ISessionRepository } from '@/domain/repositories/users/ISessionRepository.js'
import { DomainErrorCode } from '@/domain/shared/DomainErrorCode.js'
import { createDomainError } from '@/domain/shared/DomainError.js'

type LoginInput = {
  email: string
  password: string
}

export const loginUserUseCase = async (
  userRepo: IUserRepository,
  sessionRepo: ISessionRepository,
  tokenService: ITokenService,
  input: LoginInput
) => {
  const email = input.email.trim().toLowerCase()
  const password = input.password.trim()

  if (!email || !password) {
    throw createDomainError(DomainErrorCode.InvalidCredentials)
  }

  const user = await userRepo.login(email, password)

  if (!user || !user.id) {
    throw createDomainError(DomainErrorCode.InvalidCredentials)
  }

  const accessToken = tokenService.generateAccessToken({
    userId: user.id,
    role: user.role,
    permissions: user.permissions
  })

  const refreshToken = tokenService.generateRefreshToken({
    userId: user.id,
    role: user.role,
    permissions: user.permissions
  })

  const accessTokenExpiresIn = tokenService.getAccessTokenTtlSeconds()
  const refreshTokenExpiresIn = tokenService.getRefreshTokenTtlSeconds()
  const refreshExpiresAt = new Date(Date.now() + (refreshTokenExpiresIn * 1000))

  await sessionRepo.create({
    userId: user.id,
    refreshTokenHash: refreshToken,
    expiresAt: refreshExpiresAt,
    revokedAt: null
  })

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: accessTokenExpiresIn,
    expiresAt: new Date(Date.now() + (accessTokenExpiresIn * 1000)).toISOString(),
    refreshTokenExpiresIn,
    refreshTokenExpiresAt: new Date(Date.now() + (refreshTokenExpiresIn * 1000)).toISOString(),
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    }
  }
}
