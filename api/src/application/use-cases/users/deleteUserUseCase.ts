import { IUserRepository } from '@/domain/repositories/users/IUserRepository.js'

export const deleteUserUseCase = async (
  userRepo: IUserRepository,
  id: string
): Promise<void> => {
  const existing = await userRepo.findById(id)

  if (!existing) throw new Error('Usuario no encontrado')

  await userRepo.remove(id)
}
