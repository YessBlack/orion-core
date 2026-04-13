import { TokenService } from '@/application/services/token.service.js'
import { AppErrorCode } from '@/application/shared/error-codes.js'
import { AccessLevel } from '@/domain/shared/AccessLevel.js'
import { IUserRepository } from '@/domain/repositories/users/IUserRepository.js'

type LoginInput = {
  email: string
  password: string
}

export const loginUserUseCase = async (
  userRepo: IUserRepository,
  tokenService: TokenService,
  input: LoginInput
) => {
  const email = input.email.trim().toLowerCase()
  const password = input.password.trim()

  if (!email || !password) {
    throw new Error(AppErrorCode.InvalidCredentials)
  }

  const user = await userRepo.authenticate(email, password)

  if (!user || !user.id) {
    throw new Error(AppErrorCode.InvalidCredentials)
  }

  const token = tokenService.generate({
    userId: user.id,
    role: user.role,
    apiAccessLevel: user.apiAccessLevel ?? AccessLevel.None,
    permissions: user.permissions
  })

  const expiresIn = tokenService.getAccessTokenTtlSeconds()

  return {
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn,
    expiresAt: new Date(Date.now() + (expiresIn * 1000)).toISOString(),
    user: {
      name: user.name,
      email: user.email
    }
  }
}
