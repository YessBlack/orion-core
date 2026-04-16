import { Response } from 'express'
import { AppError } from './types.js'

export const writeJSON = (
  res: Response,
  status: number,
  data: unknown,
  meta?: Record<string, unknown>
) => {
  return res.status(status).json({
    data,
    ...(meta && { meta })
  })
}

export const writeError = (res: Response, appError: AppError) => {
  return res.status(appError.status).json({
    error: {
      code: appError.code,
      message: appError.message
    }
  })
}
