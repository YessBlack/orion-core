import { ChangePasswordDTO, IUserRepository } from '@/domain/repositories/users/IUserRepository.js'
import { createDomainError } from '@/domain/shared/DomainError.js'
import { DomainErrorCode } from '@/domain/shared/DomainErrorCode.js'

export const changePasswordUseCase = async (
  userRepo: IUserRepository,
  data: ChangePasswordDTO
): Promise<void> => {
  const user = await userRepo.findById(data.userId)
  if (!user) throw createDomainError(DomainErrorCode.UserNotFound)

  if (data.newPassword !== data.confirmPassword) {
    throw createDomainError(DomainErrorCode.PasswordsDoNotMatch)
  }

  return userRepo.changePassword(data)
}
