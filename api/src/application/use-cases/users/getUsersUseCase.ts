import { IUserRepository } from '@/domain/repositories/users/IUserRepository.js'

export const getUsersUseCase = async (userRepo: IUserRepository) => {
  return userRepo.list()
}
