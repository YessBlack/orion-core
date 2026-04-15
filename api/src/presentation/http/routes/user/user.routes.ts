import { Router } from 'express'
import {
  listUsersHandler,
  createUserHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  updateUserHandler,
  deleteUserHandler
} from '../../handlers/user/user.handler.js'
import { createAuthMiddleware, requireRoles } from '../../middleware/auth.middleware.js'
import { jwtService } from '@/infrastructure/services/jwt.service.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'

const userRoutes = Router()
const authMiddleware = createAuthMiddleware(jwtService)

userRoutes.get('/users', authMiddleware, requireRoles(UserRole.Admin), listUsersHandler)
userRoutes.post('/users', authMiddleware, requireRoles(UserRole.Admin), createUserHandler)
userRoutes.post('/auth/login', loginHandler)
userRoutes.post('/auth/refresh', refreshHandler)
userRoutes.post('/auth/logout', logoutHandler)
userRoutes.patch('/users/:id', authMiddleware, requireRoles(UserRole.Admin), updateUserHandler)
userRoutes.delete('/users/:id', authMiddleware, requireRoles(UserRole.Admin), deleteUserHandler)

export { userRoutes }
