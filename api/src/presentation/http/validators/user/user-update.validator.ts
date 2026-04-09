import { UserRole } from '@/domain/entities/users/User.js'
import { AppModule, PermissionLevel, UserPermission } from '@/domain/entities/users/UserPermission.js'
import { UpdateUserDTO } from '@/domain/repositories/users/IUserRepository.js'

type ValidationSuccess<T> = {
  valid: true
  errors: []
  value: T
}

type ValidationFailure = {
  valid: false
  errors: string[]
}

export type UserUpdateValidationResult =
  ValidationSuccess<UpdateUserDTO> | ValidationFailure

const ALLOWED_FIELDS = new Set([
  'name',
  'email',
  'role',
  'permissions',
  'isDefault',
  'isActive'
])

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

export const validateUserUpdatePayload = (
  payload: unknown
): UserUpdateValidationResult => {
  const errors: string[] = []

  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: ['payload must be an object']
    }
  }

  const body = payload as Record<string, unknown>
  const keys = Object.keys(body)

  if (keys.length === 0) {
    return {
      valid: false,
      errors: ['payload must include at least one field to update']
    }
  }

  const invalidFields = keys.filter((key) => !ALLOWED_FIELDS.has(key))
  if (invalidFields.length > 0) {
    errors.push(`payload contains unsupported fields: ${invalidFields.join(', ')}`)
  }

  if ('name' in body && !isNonEmptyString(body.name)) {
    errors.push('name must be a non-empty string')
  }

  if ('email' in body && !isEmail(body.email)) {
    errors.push('email must be a valid email')
  }

  if ('role' in body && (typeof body.role !== 'string' || !USER_ROLES.has(body.role))) {
    errors.push(`role must be one of: ${Object.values(UserRole).join(', ')}`)
  }

  if ('permissions' in body && !isPermissionList(body.permissions)) {
    errors.push('permissions must be a valid permission list')
  }

  if ('isDefault' in body && !isBoolean(body.isDefault)) {
    errors.push('isDefault must be a boolean')
  }

  if ('isActive' in body && !isBoolean(body.isActive)) {
    errors.push('isActive must be a boolean')
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors
    }
  }

  const value: UpdateUserDTO = {}

  if (typeof body.name === 'string') value.name = body.name
  if (typeof body.email === 'string') value.email = body.email.trim().toLowerCase()
  if (typeof body.role === 'string') value.role = body.role as UserRole
  if (Array.isArray(body.permissions)) value.permissions = body.permissions as UserPermission[]
  if (typeof body.isDefault === 'boolean') value.isDefault = body.isDefault
  if (typeof body.isActive === 'boolean') value.isActive = body.isActive

  return {
    valid: true,
    errors: [],
    value
  }
}
