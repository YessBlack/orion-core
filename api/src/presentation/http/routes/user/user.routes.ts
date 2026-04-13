import { Router } from 'express'
import {
  listUsersHandler,
  createUserHandler,
  loginHandler,
  registerHandler,
  updateUserHandler,
  deleteUserHandler
} from '../../handlers/user/user.handler.js'
import { createAuthMiddleware, requireApiAccess, requireRoles } from '../../middleware/auth.middleware.js'
import { jwtService } from '@/infrastructure/services/jwt.service.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'

const userRoutes = Router()
const authMiddleware = createAuthMiddleware(jwtService)

userRoutes.get('/users', authMiddleware, requireApiAccess(), requireRoles(UserRole.Admin), listUsersHandler)
userRoutes.post('/users', authMiddleware, requireApiAccess(), requireRoles(UserRole.Admin), createUserHandler)
userRoutes.post('/auth/register', registerHandler)
userRoutes.post('/auth/login', loginHandler)
userRoutes.patch('/users/:id', authMiddleware, requireApiAccess(), requireRoles(UserRole.Admin), updateUserHandler)
userRoutes.delete('/users/:id', authMiddleware, requireApiAccess(), requireRoles(UserRole.Admin), deleteUserHandler)

export { userRoutes }
