import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string({ required_error: 'email is required' }).email('email must be a valid email'),
  password: z.string({ required_error: 'password is required' }).min(1, 'password is required')
})

export const userIdParamSchema = z.object({
  id: z.string().trim().min(1)
})

export type LoginInput = z.infer<typeof loginSchema>
