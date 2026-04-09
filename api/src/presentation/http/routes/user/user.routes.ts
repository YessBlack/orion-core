import { Router } from 'express'
import {
  listUsersHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler
} from '../../handlers/user/user.handler.js'

const userRoutes = Router()

userRoutes.get('/users', listUsersHandler)
userRoutes.post('/users', createUserHandler)
userRoutes.patch('/users/:id', updateUserHandler)
userRoutes.delete('/users/:id', deleteUserHandler)

export { userRoutes }
