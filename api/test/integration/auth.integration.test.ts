import { describe, beforeAll, it, expect } from '@jest/globals'
import { getTestApp } from '../helpers/test-app.js'
import { authenticateDatabase } from '@/infrastructure/database/database.js'
import request from 'supertest'

describe('Auth Integration', () => {
  const app = getTestApp()

  const testEmail = process.env.TEST_USER_EMAIL || 'admin-api@orion.local'
  const testPassword = process.env.TEST_USER_PASSWORD || '123456789'

  let refreshToken1 = ''
  let refreshToken2 = ''
  let refreshToken3 = ''

  beforeAll(async () => {
    await authenticateDatabase()
  })

  it('login should return access and refresh tokens', async () => {
    const res = await request(app)
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
    expect(res.body?.data?.refreshToken).toBeDefined()

    refreshToken1 = res.body.data.refreshToken
  })

  it('refresh should rotate token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({
        refreshToken: refreshToken1
      })

    expect(res.status).toBe(200)
    expect(res.body?.data?.refreshToken).toBeDefined()
    expect(res.body?.data?.refreshToken).not.toBe(refreshToken1)

    refreshToken2 = res.body.data.refreshToken
  })

  it('refresh with current token should still work', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({
        refreshToken: refreshToken2
      })

    expect(res.status).toBe(200)
    expect(res.body?.data?.refreshToken).toBeDefined()

    refreshToken3 = res.body.data.refreshToken
  })

  it('logout should revoke current session', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .send({
        refreshToken: refreshToken3
      })

    expect(res.status).toBe(200)
    expect(res.body?.data?.message).toBeDefined()
  })

  it('refresh should fail after logout', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({
        refreshToken: refreshToken3
      })

    expect(res.status).toBe(401)
  })

  it('register should create new user', async () => {
    const randomSuffix = Date.now()
    const email = `test.user.${randomSuffix}@orion.local`
    const password = 'password123'

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: `Test User ${randomSuffix}`,
        email,
        password,
        passwordConfirm: password
      })

    expect(res.status).toBe(201)
    expect(res.body?.data?.id).toBeDefined()
    expect(res.body?.data?.email).toBe(email)
  })

  it('register with existing email should fail', async () => {
    const randomSuffix = Date.now()
    const email = `existing.user.${randomSuffix}@orion.local`
    const password = 'password123'

    const res1 = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Existing User',
        email,
        password,
        passwordConfirm: password
      })

    expect(res1.status).toBe(201)

    const res2 = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Existing User 2',
        email,
        password,
        passwordConfirm: password
      })

    expect(res2.status).toBe(409)
  })
})
