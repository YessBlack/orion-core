import { AppErrorCode } from './AppErrorCode.js'

export type AppError = Error & {
  readonly isAppError: true
  readonly code: AppErrorCode
}

export const createAppError = (code: AppErrorCode): AppError => {
  const error = Object.assign(new Error(code), {
    name: 'AppError',
    isAppError: true as const,
    code
  })
  return error
}

export const isAppError = (error: unknown): error is AppError => {
  return (
    error instanceof Error &&
    'isAppError' in error &&
    (error as AppError).isAppError === true
  )
}
