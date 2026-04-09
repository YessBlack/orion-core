import { User } from '@/domain/entities/users/User.js'
import { RecordModel } from 'pocketbase'

export const mapToUser = (record: RecordModel): User => {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    permissions: record.permissions,
    isDefault: record.isDefault,
    isActive: record.isActive,
    createdAt: new Date(record.created),
    updatedAt: new Date(record.updated)
  }
}
