import { ErrorCode } from './constants.js'

export type AppError = {
  code: ErrorCode
  message: string
  status: number
}
