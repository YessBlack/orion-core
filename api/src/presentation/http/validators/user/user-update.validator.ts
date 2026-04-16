import { UserRole } from '@/domain/entities/users/UserRole.js'
import { AppModule, UserPermission } from '@/domain/entities/users/UserPermission.js'
import { AccessLevel } from '@/domain/shared/AccessLevel.js'
import { UpdateUserDTO } from '@/domain/repositories/users/IUserRepository.js'
import { z } from 'zod'

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

const permissionSchema = z.object({
  module: z.nativeEnum(AppModule),
  level: z.nativeEnum(AccessLevel)
})

const updateUserSchema = z.object({
  name: z.string().trim().min(1, 'name must be a non-empty string').optional(),
  email: z.string().trim().email('email must be a valid email').optional(),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: `role must be one of: ${Object.values(UserRole).join(', ')}` })
  }).optional(),
  permissions: z.array(permissionSchema, {
    errorMap: () => ({ message: 'permissions must be a valid permission list' })
  }).optional(),
  isDefault: z.boolean({ errorMap: () => ({ message: 'isDefault must be a boolean' }) }).optional(),
  isActive: z.boolean({ errorMap: () => ({ message: 'isActive must be a boolean' }) }).optional()
}).strict()

export const validateUserUpdatePayload = (
  payload: unknown
): UserUpdateValidationResult => {
  const result = updateUserSchema.safeParse(payload)

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map((issue) => issue.message)
    }
  }

  const body = result.data
  const keys = Object.keys(body)

  if (keys.length === 0) {
    return {
      valid: false,
      errors: ['payload must include at least one field to update']
    }
  }

  const value: UpdateUserDTO = {}

  if (body.name !== undefined) value.name = body.name
  if (body.email !== undefined) value.email = body.email.toLowerCase()
  if (body.role !== undefined) value.role = body.role
  if (body.permissions !== undefined) value.permissions = body.permissions as UserPermission[]
  if (body.isDefault !== undefined) value.isDefault = body.isDefault
  if (body.isActive !== undefined) value.isActive = body.isActive

  return {
    valid: true,
    errors: [],
    value
  }
}
