import { UserRole } from '@/domain/entities/users/User.js'
import { AppModule, PermissionLevel, UserPermission } from '@/domain/entities/users/UserPermission.js'
import { CreateUserDTO } from '@/domain/repositories/users/IUserRepository.js'

type ValidationSuccess<T> = {
  valid: true
  errors: []
  value: T
}

type ValidationFailure = {
  valid: false
  errors: string[]
}

export type UserCreateValidationResult =
  ValidationSuccess<CreateUserDTO> | ValidationFailure

const USER_ROLES = new Set<string>(Object.values(UserRole))
const MODULES = new Set<string>(Object.values(AppModule))
const LEVELS = new Set<string>(Object.values(PermissionLevel))

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}

const isEmail = (value: unknown): value is string => {
  if (typeof value !== 'string') return false

  const email = value.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isUserPermission = (value: unknown): value is UserPermission => {
  if (!value || typeof value !== 'object') return false

  const permission = value as Record<string, unknown>

  return (
    typeof permission.module === 'string' &&
    typeof permission.level === 'string' &&
    MODULES.has(permission.module) &&
    LEVELS.has(permission.level)
  )
}

const isPermissionList = (value: unknown): value is UserPermission[] => {
  return Array.isArray(value) && value.every(isUserPermission)
}

export const validateUserCreatePayload = (
  payload: unknown
): UserCreateValidationResult => {
  const errors: string[] = []

  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: ['payload must be an object']
    }
  }

  const body = payload as Record<string, unknown>

  if (!isNonEmptyString(body.name)) {
    errors.push('name is required and must be a non-empty string')
  }

  if (!isEmail(body.email)) {
    errors.push('email is required and must be a valid email')
  }

  if (typeof body.role !== 'string' || !USER_ROLES.has(body.role)) {
    errors.push(`role is required and must be one of: ${Object.values(UserRole).join(', ')}`)
  }

  if (!isPermissionList(body.permissions)) {
    errors.push('permissions is required and must be a valid permission list')
  }

  if (!isBoolean(body.isDefault)) {
    errors.push('isDefault is required and must be a boolean')
  }

  if (!isBoolean(body.isActive)) {
    errors.push('isActive is required and must be a boolean')
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors
    }
  }

  const value: CreateUserDTO = {
    name: body.name as string,
    email: (body.email as string).trim().toLowerCase(),
    role: body.role as UserRole,
    permissions: body.permissions as UserPermission[],
    isDefault: body.isDefault as boolean,
    isActive: body.isActive as boolean
  }

  return {
    valid: true,
    errors: [],
    value
  }
}
