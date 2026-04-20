import { Response } from 'express'

import { z } from 'zod'

const COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || 'orion_refresh_token'
const IS_PROD = process.env.NODE_ENV === 'production'
const COOKIE_SECURE = (process.env.REFRESH_COOKIE_SECURE ?? (IS_PROD ? 'true' : 'false')) === 'true'
const COOKIE_SAME_SITE = (process.env.REFRESH_COOKIE_SAMESITE as 'lax' | 'strict' | 'none') || 'lax'

export const setRefreshTokenCookie = (
  res: Response,
  token: string,
  maxAgeSeconds: number
) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    maxAge: maxAgeSeconds * 1000,
    path: '/api/v1/auth'
  })
}

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    path: '/api/v1/auth'
  })
}

export const getRefreshTokenFromCookie = (
  cookies?: Record<string, unknown>
): string | null => {
  const value = cookies?.[COOKIE_NAME]

  const parsed = z
    .string()
    .trim()
    .min(1)
    .safeParse(value)

  if (!parsed.success) {
    return null
  }

  return parsed.data
}
