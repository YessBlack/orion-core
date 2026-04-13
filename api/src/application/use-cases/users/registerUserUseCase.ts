import { AppErrorCode } from '@/application/shared/error-codes.js'
import { IUserRepository } from '@/domain/repositories/users/IUserRepository.js'

type RegisterInput = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export const registerUserUseCase = async (
  userRepo: IUserRepository,
  input: RegisterInput
) => {
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  const password = input.password.trim()
  const passwordConfirm = input.passwordConfirm.trim()

  if (!name || !email || !password || !passwordConfirm) {
    throw new Error(AppErrorCode.InvalidRegisterPayload)
  }

  if (password !== passwordConfirm) {
    throw new Error(AppErrorCode.PasswordsDoNotMatch)
  }

  const existing = await userRepo.findByEmail(email)

  if (existing) {
    throw new Error(AppErrorCode.EmailAlreadyExists)
  }

  const user = await userRepo.register({
    name,
    email,
    password,
    passwordConfirm
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
}
