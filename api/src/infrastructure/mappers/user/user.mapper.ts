import { User } from '@/domain/entities/users/User.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'
import { UserPermission } from '@/domain/entities/users/UserPermission.js'
import { AccessLevel } from '@/domain/shared/AccessLevel.js'
import { RecordModel } from 'pocketbase'

const isUserRole = (value: unknown): value is UserRole => {
  return typeof value === 'string' && Object.values(UserRole).includes(value as UserRole)
}

const isUserPermissionList = (value: unknown): value is UserPermission[] => {
  return Array.isArray(value)
}

export const mapToUser = (record: RecordModel): User => {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: isUserRole(record.role) ? record.role : UserRole.Seller,
    permissions: isUserPermissionList(record.permissions) ? record.permissions : [],
    apiAccessLevel: record.apiAccessLevel ?? AccessLevel.None,
    isDefault: record.isDefault,
    isActive: record.isActive,
    createdAt: new Date(record.created),
    updatedAt: new Date(record.updated)
  }
}
