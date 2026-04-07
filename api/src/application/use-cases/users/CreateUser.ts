import { User } from '@/domain/entities/users/User.js'
import { CreateUserDTO, IUserRepository } from '@/domain/repositories/users/IUserRepository.js'

export const createUser = async (
  userRepo: IUserRepository,
  data: CreateUserDTO
): Promise<User> => {
  const existing = await userRepo.findByEmail(data.email)

  if (existing) throw new Error(`Ya existe un usuario con el email ${data.email}`)

  return userRepo.create(data)
}
