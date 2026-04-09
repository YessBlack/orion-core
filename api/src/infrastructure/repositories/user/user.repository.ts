import { CreateUserDTO, IUserRepository, UpdateUserDTO } from '@/domain/repositories/users/IUserRepository.js'
import { pb } from '../../database/database.js'
import { mapToUser } from '../../mappers/user/user.mapper.js'

const USER_COLLECTION = 'users'

const list = async () => {
  const records = await pb.collection(USER_COLLECTION).getFullList()
  return records.map(mapToUser)
}

const findById = async (id: string) => {
  try {
    const record = await pb.collection(USER_COLLECTION).getOne(id)
    return mapToUser(record)
  } catch {
    return null
  }
}

const findByEmail = async (email: string) => {
  try {
    const record = await pb
      .collection(USER_COLLECTION)
      .getFirstListItem(`email="${email}"`)

    return mapToUser(record)
  } catch {
    return null
  }
}

const create = async (data: CreateUserDTO) => {
  try {
    const record = await pb.collection(USER_COLLECTION).create(data)

    return mapToUser(record)
  } catch {
    throw new Error('Failed to create user')
  }
}

const update = async (id: string, data: UpdateUserDTO) => {
  try {
    const record = await pb.collection(USER_COLLECTION).update(id, data)

    return mapToUser(record)
  } catch {
    throw new Error('Failed to update user')
  }
}

const remove = async (id: string) => {
  try {
    await pb.collection(USER_COLLECTION).delete(id)
  } catch {
    throw new Error('Failed to remove user')
  }
}

export const userRepository: IUserRepository = {
  list,
  findById,
  findByEmail,
  create,
  update,
  remove
}
