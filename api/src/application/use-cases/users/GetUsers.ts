import { IUserRepository } from '@/domain/repositories/users/IUserRepository.js'

export const getUsers = async (userRepo: IUserRepository) => {
  return userRepo.findAll()
}
