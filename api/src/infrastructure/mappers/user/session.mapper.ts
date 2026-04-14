import { Session } from '@/domain/entities/users/Session.js'
import { RecordModel } from 'pocketbase'

export const mapToSession = (record: RecordModel): Session => {
  return {
    id: record.id,
    userId: record.userId,
    refreshTokenHash: record.refreshTokenHash,
    expiresAt: new Date(record.expiresAt),
    revokedAt: record.revokedAt ? new Date(record.revokedAt) : null,
    createdAt: new Date(record.created)
  }
}
