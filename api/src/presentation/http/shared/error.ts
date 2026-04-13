import { ErrorCode } from './constants.js'
import { AppError } from './types.js'
import { AppErrorCode } from '@/application/shared/error-codes.js'

export const mapError = (error: unknown): AppError => {
  if (error instanceof Error) {
    if (error.message === AppErrorCode.InvalidCredentials || error.message === AppErrorCode.InvalidToken) {
      return {
        code: ErrorCode.Unauthorized,
        message: error.message,
        status: 401
      }
    }

    if (error.message === AppErrorCode.EmailAlreadyExists) {
      return {
        code: ErrorCode.Conflict,
        message: error.message,
        status: 409
      }
    }

    if (
      error.message === AppErrorCode.InvalidRegisterPayload ||
      error.message === AppErrorCode.PasswordsDoNotMatch
    ) {
      return {
        code: ErrorCode.BadRequest,
        message: error.message,
        status: 400
      }
    }

    const message = error.message.toLowerCase()

    if (
      message.includes('invalid_credentials') ||
      message.includes('invalid token') ||
      message.includes('unauthorized')
    ) {
      return {
        code: ErrorCode.Unauthorized,
        message: error.message,
        status: 401
      }
    }

    if (message.includes('email_already_exists')) {
      return {
        code: ErrorCode.Conflict,
        message: error.message,
        status: 409
      }
    }

    if (
      message.includes('invalid') ||
      message.includes('required') ||
      message.includes('validation') ||
      message.includes('passwords_do_not_match')
    ) {
      return {
        code: ErrorCode.BadRequest,
        message: error.message,
        status: 400
      }
    }

    if (
      message.includes('not found') ||
      message.includes('does not exist')
    ) {
      return {
        code: ErrorCode.NotFound,
        message: error.message,
        status: 404
      }
    }

    if (
      message.includes('already exists') ||
      message.includes('duplicate') ||
      message.includes('conflict')
    ) {
      return {
        code: ErrorCode.Conflict,
        message: error.message,
        status: 409
      }
    }

    return {
      code: ErrorCode.InternalError,
      message: error.message,
      status: 500
    }
  }

  return {
    code: ErrorCode.UnknownError,
    message: 'An unknown error occurred',
    status: 500
  }
}
