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
import { loginUserUseCase } from '../../../../application/use-cases/users/loginUserUseCase.js'
import { jwtService } from '@/infrastructure/services/jwt.service.js'
import { registerUserUseCase } from '@/application/use-cases/users/registerUserUseCase.js'
import { loginSchema, registerSchema, userIdParamSchema } from '../../validators/auth/auth.validator.js'
import { ZodIssue } from 'zod'

const joinIssueMessages = (issues: ZodIssue[]) => {
  return issues.map((issue) => issue.message).join('; ')
}

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
    const idResult = userIdParamSchema.safeParse(req.params)
    if (!idResult.success) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: joinIssueMessages(idResult.error.issues),
        status: 400
      })
    }
    const id = idResult.data.id

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
    const idResult = userIdParamSchema.safeParse(req.params)
    if (!idResult.success) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: joinIssueMessages(idResult.error.issues),
        status: 400
      })
    }
    const id = idResult.data.id

    await deleteUserUseCase(userRepository, id)
    return writeJSON(res, 200, { message: 'User deleted successfully' })
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const bodyResult = loginSchema.safeParse(req.body)
    if (!bodyResult.success) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: joinIssueMessages(bodyResult.error.issues),
        status: 400
      })
    }

    const { email, password } = bodyResult.data

    const result = await loginUserUseCase(userRepository, jwtService, { email, password })

    return writeJSON(res, 200, result)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const bodyResult = registerSchema.safeParse(req.body)
    if (!bodyResult.success) {
      return writeError(res, {
        code: ErrorCode.BadRequest,
        message: joinIssueMessages(bodyResult.error.issues),
        status: 400
      })
    }

    const { name, email, password, passwordConfirm } = bodyResult.data

    const result = await registerUserUseCase(userRepository, {
      name,
      email,
      password,
      passwordConfirm
    })

    return writeJSON(res, 201, result)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}
