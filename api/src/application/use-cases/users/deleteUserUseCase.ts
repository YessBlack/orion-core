import { UserRole } from '@/domain/entities/users/UserRole.js'
import { IUserRepository } from '@/domain/repositories/users/IUserRepository.js'
import { createDomainError } from '@/domain/shared/DomainError.js'
import { DomainErrorCode } from '@/domain/shared/DomainErrorCode.js'

export const deleteUserUseCase = async (
  userRepo: IUserRepository,
  id: string
): Promise<void> => {
  const user = await userRepo.findById(id)
  if (!user) throw createDomainError(DomainErrorCode.UserNotFound)

  if (user.isDefault && user.role && user.role !== UserRole.Admin) {
    throw createDomainError(DomainErrorCode.CannotDeleteDefaultUser)
  }

  return userRepo.remove(id)
}
