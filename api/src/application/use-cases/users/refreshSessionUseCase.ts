import { TokenService } from '@/application/services/token.service.js'
import { AppErrorCode } from '@/application/shared/error-codes.js'
import { ISessionRepository } from '@/domain/repositories/users/ISessionRepository.js'

type RefreshSessionInput = {
  refreshToken: string
}

export const refreshSessionUseCase = async (
  sessionRepo: ISessionRepository,
  tokenService: TokenService,
  hashRefreshToken: (token: string) => Promise<string>,
  input: RefreshSessionInput
) => {
  const refreshToken = input.refreshToken.trim()

  if (!refreshToken) {
    throw new Error(AppErrorCode.InvalidToken)
  }

  const payload = tokenService.validateRefreshToken(refreshToken)
  const refreshTokenHash = await hashRefreshToken(refreshToken)

  const session = await sessionRepo.findActiveByHash(refreshTokenHash)
  const now = new Date()

  if (!session || session.userId !== payload.userId) {
    throw new Error(AppErrorCode.InvalidToken)
  }

  const isSessionRevoked = session.revokedAt !== null
  const isSessionExpired = session.expiresAt.getTime() <= now.getTime()

  if (isSessionRevoked || isSessionExpired) {
    throw new Error(AppErrorCode.InvalidToken)
  }

  const accessToken = tokenService.generateAccessToken(payload)
  const nextRefreshToken = tokenService.generateRefreshToken(payload)
  const nextRefreshTokenHash = await hashRefreshToken(nextRefreshToken)

  const accessTokenExpiresIn = tokenService.getAccessTokenTtlSeconds()
  const refreshTokenExpiresIn = tokenService.getRefreshTokenTtlSeconds()
  const refreshTokenExpiresAt = new Date(Date.now() + (refreshTokenExpiresIn * 1000))

  await sessionRepo.revokeById(session.id)

  await sessionRepo.create({
    userId: payload.userId,
    refreshTokenHash: nextRefreshTokenHash,
    expiresAt: refreshTokenExpiresAt,
    revokedAt: null
  })

  return {
    accessToken,
    refreshToken: nextRefreshToken,
    tokenType: 'Bearer',
    expiresIn: accessTokenExpiresIn,
    expiresAt: new Date(Date.now() + (accessTokenExpiresIn * 1000)).toISOString(),
    refreshTokenExpiresIn,
    refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString()
  }
}
