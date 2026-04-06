import { UserPermission } from './UserPermission.js'

export enum UserRole {
  Admin = 'ADMIN',
  Seller = 'SELLER',
  Warehouse = 'WAREHOUSE',
}

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
