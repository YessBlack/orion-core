import { IUserRepository, UpdateUserDTO } from "@/domain/repositories/users/IUserRepository.js";

export const updateUser = async (
  userRepo: IUserRepository,
  id: string,
  data: UpdateUserDTO
) => {
  const existing = await userRepo.findById(id)

  if (!existing) throw new Error(`Usuario no encontrado`)

  if (data.email && data.email !== existing.email) {
    const emailTaken = await userRepo.findByEmail(data.email)
    if (emailTaken) throw new Error(`Ya existe un usuario con el email ${data.email}`)
  }

  return userRepo.update(id, data)
}
