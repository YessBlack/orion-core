import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string({ required_error: 'email is required' }).email('email must be a valid email'),
  password: z.string({ required_error: 'password is required' }).min(1, 'password is required')
})

export const refreshSchema = z.object({
  refreshToken: z
    .string({ required_error: 'refreshToken is required' })
    .trim()
    .min(1, 'refreshToken is required')
})

export const logoutSchema = z.object({
  refreshToken: z
    .string({ required_error: 'refreshToken is required' })
    .trim()
    .min(1, 'refreshToken is required')
})

export const registerSchema = z.object({
  name: z.string({ required_error: 'name is required' }).min(1, 'name is required'),
  email: z.string({ required_error: 'email is required' }).email('email must be a valid email'),
  password: z
    .string({ required_error: 'password is required' })
    .min(8, 'password must have at least 8 characters'),
  passwordConfirm: z
    .string({ required_error: 'passwordConfirm is required' })
    .min(8, 'passwordConfirm must have at least 8 characters')
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm']
})

export const userIdParamSchema = z.object({
  id: z.string().trim().min(1)
})

export type LoginInput = z.infer<typeof loginSchema>
export type RefreshInput = z.infer<typeof refreshSchema>
export type LogoutInput = z.infer<typeof logoutSchema>
export type RegisterInput = z.infer<typeof registerSchema>
