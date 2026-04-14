import { CreateUserDTO, IUserRepository, RegisterUserDTO, UpdateUserDTO } from '@/domain/repositories/users/IUserRepository.js'
import { POCKETBASE_URL, pb } from '../../database/database.js'
import { mapToUser } from '../../mappers/user/user.mapper.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'
import PocketBase from 'pocketbase'

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

const authenticate = async (email: string, password: string) => {
  try {
    // Use a dedicated client to avoid replacing the shared admin authStore.
    const authClient = new PocketBase(POCKETBASE_URL)
    const authResult = await authClient
      .collection(USER_COLLECTION)
      .authWithPassword(email, password)
    return mapToUser(authResult.record)
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

const register = async (data: RegisterUserDTO) => {
  try {
    const record = await pb.collection(USER_COLLECTION).create({
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      role: UserRole.Seller,
      permissions: [],
      isDefault: false,
      isActive: true
    })

    return mapToUser(record)
  } catch {
    throw new Error('Failed to register user')
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
  authenticate,
  register,
  create,
  update,
  remove
}
