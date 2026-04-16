import { pb } from '../../database/database.js'
import { CreateSessionDTO, ISessionRepository } from '@/domain/repositories/users/ISessionRepository.js'
import { mapToSession } from '@/infrastructure/mappers/user/session.mapper.js'

const SESSION_COLLECTION = 'sessions'

const create = async (data: CreateSessionDTO) => {
  try {
    const record = await pb.collection(SESSION_COLLECTION).create(data)

    return mapToSession(record)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to create session: ${message}`)
  }
}

const findActiveByHash = async (refreshTokenHash: string) => {
  try {
    const record = await pb
      .collection(SESSION_COLLECTION)
      .getFirstListItem(`refreshTokenHash="${refreshTokenHash}"`)

    return mapToSession(record)
  } catch {
    return null
  }
}

const revokeById = async (id: string) => {
  try {
    await pb.collection(SESSION_COLLECTION).update(id, {
      revokedAt: new Date().toISOString()
    })
  } catch {
    throw new Error('Failed to revoke session')
  }
}

const revokeAllByUserId = async (userId: string) => {
  try {
    const records = await pb
      .collection(SESSION_COLLECTION)
      .getFullList({ filter: `userId="${userId}"` })

    const updatePromises = records.map(record =>
      pb.collection(SESSION_COLLECTION).update(record.id, {
        revokedAt: new Date().toISOString()
      })
    )

    await Promise.all(updatePromises)
  } catch {
    throw new Error('Failed to revoke sessions')
  }
}

export const sessionRepository: ISessionRepository = {
  create,
  findActiveByHash,
  revokeById,
  revokeAllByUserId
}

