import { IUserRepository } from '@/domain/repositories/users/IUserRepository.js'

export const deleteUser = async (
  userRepo: IUserRepository,
  id: string
): Promise<void> => {
  const existing = await userRepo.findById(id)

  if (!existing) throw new Error('Usuario no encontrado')

  await userRepo.delete(id)
}
