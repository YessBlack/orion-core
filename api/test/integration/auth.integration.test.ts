import { describe, beforeAll, it, expect } from '@jest/globals'
import { getTestApp } from '../helpers/test-app.js'
import { authenticateDatabase } from '@/infrastructure/database/database.js'
import request, { Response, SuperAgentTest } from 'supertest'

describe('Auth Integration', () => {
  const app = getTestApp()
  let agent: SuperAgentTest

  const testEmail = process.env.TEST_USER_EMAIL || 'admin-api@orion.local'
  const testPassword = process.env.TEST_USER_PASSWORD || '123456789'
  const refreshCookieName = process.env.REFRESH_COOKIE_NAME || 'orion_refresh_token'

  let refreshTokenCookie1 = ''
  let refreshTokenCookie2 = ''
  let refreshTokenCookie3 = ''

  const getCookieValue = (res: Response, cookieName: string): string | null => {
    const setCookieHeader = res.headers['set-cookie']

    if (!Array.isArray(setCookieHeader)) return null

    const targetCookie = setCookieHeader.find((cookie) => cookie.startsWith(`${cookieName}=`))
    if (!targetCookie) return null

    const [cookiePair] = targetCookie.split(';')
    const [, cookieValue] = cookiePair.split('=')

    return cookieValue ?? null
  }

  beforeAll(async () => {
    await authenticateDatabase()
    agent = request.agent(app)
  })

  it('login should return access token and set refresh token cookie', async () => {
    const res = await agent
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: testPassword
      })

    if (res.status !== 200) {
      throw new Error(`Login failed with ${res.status}: ${JSON.stringify(res.body)}`)
    }

    expect(res.status).toBe(200)
    expect(res.body?.data?.accessToken).toBeDefined()
    expect(res.body?.data?.refreshToken).toBeUndefined()

    const cookieValue = getCookieValue(res, refreshCookieName)
    expect(cookieValue).toBeDefined()
    expect(cookieValue).not.toBeNull()

    refreshTokenCookie1 = cookieValue || ''
  })

  it('refresh should rotate cookie token', async () => {
    const res = await agent
      .post('/api/v1/auth/refresh')

    expect(res.status).toBe(200)
    expect(res.body?.data?.refreshToken).toBeUndefined()

    const cookieValue = getCookieValue(res, refreshCookieName)
    expect(cookieValue).toBeDefined()
    expect(cookieValue).not.toBeNull()
    expect(cookieValue).not.toBe(refreshTokenCookie1)

    refreshTokenCookie2 = cookieValue || ''
  })

  it('refresh with current token should still work', async () => {
    const res = await agent
      .post('/api/v1/auth/refresh')

    expect(res.status).toBe(200)
    expect(res.body?.data?.refreshToken).toBeUndefined()

    const cookieValue = getCookieValue(res, refreshCookieName)
    expect(cookieValue).toBeDefined()
    expect(cookieValue).not.toBeNull()
    expect(cookieValue).not.toBe(refreshTokenCookie2)

    refreshTokenCookie3 = cookieValue || ''
  })

  it('logout should revoke current session', async () => {
    const res = await agent
      .post('/api/v1/auth/logout')

    expect(res.status).toBe(200)
    expect(res.body?.data?.message).toBeDefined()
    expect(refreshTokenCookie3.length).toBeGreaterThan(0)
  })

  it('refresh should fail after logout', async () => {
    const res = await agent.post('/api/v1/auth/refresh')

    expect(res.status).toBe(401)
  })

  it('public register endpoint should not be exposed', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Should Not Work',
        email: 'blocked.register@orion.local',
        password: 'password123',
        passwordConfirm: 'password123'
      })

    expect(res.status).toBe(404)
  })
})
