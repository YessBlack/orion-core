import { TokenService } from '@/application/services/token.service.js'
import { AppErrorCode } from '@/application/shared/error-codes.js'
import { ISessionRepository } from '@/domain/repositories/users/ISessionRepository.js'

type LogoutInput = {
  refreshToken: string
}

export const logoutUserUseCase = async (
  sessionRepo: ISessionRepository,
  tokenService: TokenService,
  hashRefreshToken: (token: string) => Promise<string>,
  input: LogoutInput
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

  await sessionRepo.revokeById(session.id)

  return {
    message: 'Logged out successfully'
  }
}
