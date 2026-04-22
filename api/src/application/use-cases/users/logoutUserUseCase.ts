import { ITokenService } from '@/application/services/token.service.js'
import { createAppError } from '@/application/shared/AppError.js'
import { AppErrorCode } from '@/application/shared/AppErrorCode.js'
import { ISessionRepository } from '@/domain/repositories/users/ISessionRepository.js'

type LogoutInput = {
  refreshToken: string
}

export const logoutUserUseCase = async (
  sessionRepo: ISessionRepository,
  tokenService: ITokenService,
  input: LogoutInput
) => {
  const refreshToken = input.refreshToken.trim()

  if (!refreshToken) {
    throw createAppError(AppErrorCode.InvalidToken)
  }

  const payload = tokenService.validateRefreshToken(refreshToken)
  const refreshTokenHash = await tokenService.hashRefreshToken(refreshToken)

  const session = await sessionRepo.findActiveByHash(refreshTokenHash)
  const now = new Date()

  if (!session || session.userId !== payload.userId) {
    throw createAppError(AppErrorCode.InvalidToken)
  }

  const isSessionRevoked = session.revokedAt !== null
  const isSessionExpired = session.expiresAt.getTime() <= now.getTime()

  if (isSessionRevoked || isSessionExpired) {
    throw createAppError(AppErrorCode.InvalidToken)
  }

  await sessionRepo.revokeById(session.id)

  return { message: 'Logged out successfully' }
}
