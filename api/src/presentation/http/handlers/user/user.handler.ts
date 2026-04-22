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
import { refreshSessionUseCase } from '../../../../application/use-cases/users/refreshSessionUseCase.js'
import { logoutUserUseCase } from '../../../../application/use-cases/users/logoutUserUseCase.js'
import { jwtService } from '@/infrastructure/services/jwt.service.js'
import { sessionRepository } from '@/infrastructure/repositories/user/user.session.repository.js'
import { loginSchema, userIdParamSchema } from '../../validators/auth/auth.validator.js'
import { ZodIssue } from 'zod'
import { clearRefreshTokenCookie, getRefreshTokenFromCookie, setRefreshTokenCookie } from '../../shared/auth-cookie.js'
import { AppErrorCode } from '@/application/shared/AppErrorCode.js'

const joinIssueMessages = (issues: ZodIssue[]) => {
  return issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : 'payload'
    return `${path}: ${issue.message}`
  }).join('; ')
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

    const user = await updateUserUseCase(userRepository, { id, data: result.value })
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

    const result = await loginUserUseCase(
      userRepository,
      sessionRepository,
      jwtService,
      { email, password }
    )

    setRefreshTokenCookie(res, result.refreshToken, result.refreshTokenExpiresIn)

    const safeResult = {
      accessToken: result.accessToken,
      tokenType: result.tokenType,
      expiresIn: result.expiresIn,
      expiresAt: result.expiresAt,
      refreshTokenExpiresIn: result.refreshTokenExpiresIn,
      refreshTokenExpiresAt: result.refreshTokenExpiresAt,
      user: result.user
    }

    return writeJSON(res, 200, safeResult)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(req.cookies)

    if (!refreshToken) {
      return writeError(res, {
        code: ErrorCode.Unauthorized,
        message: AppErrorCode.InvalidToken,
        status: 401
      })
    }

    const result = await refreshSessionUseCase(
      sessionRepository,
      jwtService,
      { refreshToken }
    )

    setRefreshTokenCookie(res, result.refreshToken, result.refreshTokenExpiresIn)

    const safeResult = {
      accessToken: result.accessToken,
      tokenType: result.tokenType,
      expiresIn: result.expiresIn,
      expiresAt: result.expiresAt,
      refreshTokenExpiresIn: result.refreshTokenExpiresIn,
      refreshTokenExpiresAt: result.refreshTokenExpiresAt
    }

    return writeJSON(res, 200, safeResult)
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  }
}

export const logoutHandler = async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookie(req.cookies)

  try {
    if (refreshToken) {
      const result = await logoutUserUseCase(
        sessionRepository,
        jwtService,
        { refreshToken }
      )

      return writeJSON(res, 200, result)
    }

    return writeJSON(res, 200, { message: 'Logged out successfully' })
  } catch (error) {
    const appError = mapError(error)
    return writeError(res, appError)
  } finally {
    clearRefreshTokenCookie(res)
  }
}

