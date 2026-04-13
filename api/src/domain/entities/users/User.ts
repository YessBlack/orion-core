import { UserPermission } from './UserPermission.js'
import { UserRole } from './UserRole.js'
import { AccessLevel } from '@/domain/shared/AccessLevel.js'

export interface User {
  id?: string
  name: string
  email: string
  role: UserRole
  permissions: UserPermission[]
  apiAccessLevel?: AccessLevel
  isDefault: boolean
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}
