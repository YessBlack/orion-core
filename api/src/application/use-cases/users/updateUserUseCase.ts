import { IUserRepository, UpdateUserDTO } from '@/domain/repositories/users/IUserRepository.js'
import { createDomainError } from '@/domain/shared/DomainError.js'
import { DomainErrorCode } from '@/domain/shared/DomainErrorCode.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'

type UpdateUserInput = {
  id: string
  data: UpdateUserDTO
}

export const updateUserUseCase = async (
  userRepo: IUserRepository,
  input: UpdateUserInput
) => {
  const { id, data } = input
  const existing = await userRepo.findById(id)

  if (!existing) throw createDomainError(DomainErrorCode.UserNotFound)

  if (data.email && data.email !== existing.email) {
    const emailTaken = await userRepo.findByEmail(data.email)
    if (emailTaken) throw createDomainError(DomainErrorCode.EmailAlreadyExists)
  }

  if (existing.isDefault && data.role && data.role !== UserRole.Admin) {
    throw createDomainError(DomainErrorCode.CannotRemoveAdminFromDefaultUser)
  }

  return userRepo.update(id, data)
}
