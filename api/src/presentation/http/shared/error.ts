import { ErrorCode } from './constants.js'
import { AppError } from './types.js'

export const mapError = (error: unknown): AppError => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (
      message.includes('invalid') ||
      message.includes('required') ||
      message.includes('validation')
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
