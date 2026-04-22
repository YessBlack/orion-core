import { User } from '@/domain/entities/users/User.js'
import { CreateUserDTO, IUserRepository } from '@/domain/repositories/users/IUserRepository.js'
import { createDomainError } from '@/domain/shared/DomainError.js'
import { DomainErrorCode } from '@/domain/shared/DomainErrorCode.js'

export const createUserUseCase = async (
  userRepo: IUserRepository,
  data: CreateUserDTO
): Promise<User> => {
  if (data.password !== data.passwordConfirm) {
    throw createDomainError(DomainErrorCode.PasswordsDoNotMatch)
  }

  const existing = await userRepo.findByEmail(data.email)
  if (existing) throw createDomainError(DomainErrorCode.EmailAlreadyExists)

  return userRepo.create(data)
}
