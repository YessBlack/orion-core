import { AppModule, UserPermission } from '@/domain/entities/users/UserPermission.js'
import { AccessLevel } from '@/domain/shared/AccessLevel.js'
import { CreateUserDTO } from '@/domain/repositories/users/IUserRepository.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'
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

export type UserCreateValidationResult =
  ValidationSuccess<CreateUserDTO> | ValidationFailure

const permissionSchema = z.object({
  module: z.nativeEnum(AppModule),
  level: z.nativeEnum(AccessLevel)
})

const createUserSchema = z.object({
  name: z.string().trim().min(1, 'name is required and must be a non-empty string'),
  email: z.string().trim().email('email is required and must be a valid email'),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: `role is required and must be one of: ${Object.values(UserRole).join(', ')}` })
  }),
  permissions: z.array(permissionSchema, {
    errorMap: () => ({ message: 'permissions is required and must be a valid permission list' })
  }),
  isActive: z.boolean({ errorMap: () => ({ message: 'isActive is required and must be a boolean' }) }),
  password: z.string().min(8, 'password must be at least 8 characters'),
  passwordConfirm: z.string().min(1, 'passwordConfirm is required')
})

export const validateUserCreatePayload = (
  payload: unknown
): UserCreateValidationResult => {
  const result = createUserSchema.safeParse(payload)

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map((issue) => issue.message)
    }
  }

  const body = result.data

  const value: CreateUserDTO = {
    name: body.name,
    email: body.email.toLowerCase(),
    role: body.role,
    permissions: body.permissions as UserPermission[],
    isActive: body.isActive,
    password: '',
    passwordConfirm: ''
  }

  return {
    valid: true,
    errors: [],
    value
  }
}
