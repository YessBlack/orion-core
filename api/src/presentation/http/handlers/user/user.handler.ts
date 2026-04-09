import { Request, Response } from 'express'
import { createUserUseCase } from '@/application/use-cases/users/createUserUseCase.js'
import { deleteUserUseCase } from '@/application/use-cases/users/deleteUserUseCase.js'
import { getUsersUseCase } from '@/application/use-cases/users/getUsersUseCase.js'
import { updateUserUseCase } from '@/application/use-cases/users/updateUserUseCase.js'
import { userRepository } from '@/infrastructure/repositories/user/user.repository.js'
import { ErrorCode } from '../../shared/constants.js'
import { mapError } from '../../shared/error.js'
import { writeError, writeJSON } from '../../shared/response.js'
import { validateUserCreatePayload } from '../../validators/user/user-create.validator.js'
import { validateUserUpdatePayload } from '../../validators/user/user-update.validator.js'

export const listUsersHandler = async (req: Request, res: Response) => {
  try {
    const users = await getUsersUseCase(userRepository)
    return writeJSON(res, 200, users)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const result = validateUserCreatePayload(req.body)

    if (!result.valid) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: result.errors.join('; '),
        status: 400
      })
    }

    const user = await createUserUseCase(userRepository, result.value)
    return writeJSON(res, 201, user)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id

    if (typeof rawId !== 'string') {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'User id is required and must be a string',
        status: 400
      })
    }

    const id = rawId.trim()

    if (!id) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'User id cannot be empty',
        status: 400
      })
    }

    const result = validateUserUpdatePayload(req.body)

    if (!result.valid) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: result.errors.join('; '),
        status: 400
      })
    }

    const user = await updateUserUseCase(userRepository, id, result.value)
    return writeJSON(res, 200, user)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id

    if (typeof rawId !== 'string') {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'User id is required and must be a string',
        status: 400
      })
    }

    const id = rawId.trim()

    if (!id) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: 'User id cannot be empty',
        status: 400
      })
    }

    await deleteUserUseCase(userRepository, id)
    return writeJSON(res, 200, { message: 'User deleted successfully' })
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}
