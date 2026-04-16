import { describe, beforeAll, it, expect } from '@jest/globals'
import { getTestApp } from '../helpers/test-app.js'
import { authenticateDatabase } from '@/infrastructure/database/database.js'
import request from 'supertest'

describe('Security Integration', () => {
  const app = getTestApp()

  const testEmail = process.env.TEST_USER_EMAIL || 'admin-api@orion.local'

  beforeAll(async () => {
    await authenticateDatabase()
  })

  it('should include security headers from helmet', async () => {
    const res = await request(app).get('/health')

    expect(res.status).toBe(200)
    expect(res.headers['x-content-type-options']).toBeDefined()
    expect(res.headers['x-frame-options']).toBeDefined()
  })

  it('should allow configured CORS origin', async () => {
    const origin = 'http://localhost:5173'

    const res = await request(app)
      .get('/health')
      .set('Origin', origin)

    expect(res.status).toBe(200)
    expect(res.headers['access-control-allow-origin']).toBe(origin)
  })

  it('should block non-allowed CORS origin', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'http://evil.local')

    expect(res.status).toBe(500)
  })

  it('should rate limit failed login attempts after 5 tries', async () => {
    const attempts: number[] = []

    for (let i = 0; i < 6; i++) {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testEmail,
          password: 'wrong-password'
        })

      attempts.push(res.status)
    }

    expect(attempts.slice(0, 5)).toEqual([401, 401, 401, 401, 401])
    expect(attempts[5]).toBe(429)

    const blockedRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'wrong-password'
      })

    expect(blockedRes.status).toBe(429)
    expect(blockedRes.body?.error?.code).toBe('TOO_MANY_LOGIN_ATTEMPTS')
  })
})
