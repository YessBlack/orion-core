import { UserPermission } from './UserPermission.js'
import { UserRole } from './UserRole.js'

export interface User {
  id?: string
  name: string
  email: string
  role: UserRole
  permissions: UserPermission[]
  isDefault: boolean
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}
