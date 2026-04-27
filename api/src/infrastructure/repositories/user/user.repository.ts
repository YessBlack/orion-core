import { CreateUserDTO, IUserRepository, UpdateUserDTO } from '@/domain/repositories/users/IUserRepository.js'
import { POCKETBASE_URL, pb } from '../../database/database.js'
import { mapToUser } from '../../mappers/user/user.mapper.js'
import PocketBase from 'pocketbase'
import { createInfrastructureError } from '@/infrastructure/shared/InfrastructureError.js'
import { InfrastructureErrorCode } from '@/infrastructure/shared/InfrastructureErrorCode.js'
import { isNotFoundError } from '@/infrastructure/shared/pocketbaseUtils.js'

const USER_COLLECTION = 'users'

const list = async () => {
  try {
    const records = await pb.collection(USER_COLLECTION).getFullList()
    return records.map(mapToUser)
  } catch {
    throw createInfrastructureError(InfrastructureErrorCode.FailedToListUsers)
  }
}

const findById = async (id: string) => {
  try {
    const record = await pb.collection(USER_COLLECTION).getOne(id)
    return mapToUser(record)
  } catch (error) {
    if (isNotFoundError(error)) return null
    throw createInfrastructureError(InfrastructureErrorCode.FailedToFindUserById)
  }
}

const findByEmail = async (email: string) => {
  try {
    const record = await pb
      .collection(USER_COLLECTION)
      .getFirstListItem(`email="${email}"`)
    return mapToUser(record)
  } catch (error) {
    if (isNotFoundError(error)) return null
    throw createInfrastructureError(InfrastructureErrorCode.FailedToFindUserByEmail)
  }
}

const login = async (email: string, password: string) => {
  try {
    const authClient = new PocketBase(POCKETBASE_URL)
    const authResult = await authClient
      .collection(USER_COLLECTION)
      .authWithPassword(email, password)
    return mapToUser(authResult.record)
  } catch (error) {
    if (isNotFoundError(error)) return null
    throw createInfrastructureError(InfrastructureErrorCode.FailedToAuthenticateUser)
  }
}

const create = async (data: CreateUserDTO) => {
  try {
    const record = await pb.collection(USER_COLLECTION).create({
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      role: data.role,
      permissions: data.permissions,
      isActive: data.isActive
    })

    return mapToUser(record)
  } catch {
    throw createInfrastructureError(InfrastructureErrorCode.FailedToCreateUser)
  }
}

const update = async (id: string, data: UpdateUserDTO) => {
  try {
    const record = await pb.collection(USER_COLLECTION).update(id, data)

    return mapToUser(record)
  } catch {
    throw createInfrastructureError(InfrastructureErrorCode.FailedToUpdateUser)
  }
}

const remove = async (id: string) => {
  try {
    await pb.collection(USER_COLLECTION).delete(id)
  } catch {
    throw createInfrastructureError(InfrastructureErrorCode.FailedToRemoveUser)
  }
}

export const userRepository: IUserRepository = {
  list,
  findById,
  findByEmail,
  login,
  create,
  update,
  remove
}
