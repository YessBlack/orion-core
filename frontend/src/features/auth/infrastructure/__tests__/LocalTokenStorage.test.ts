import { ACCESS_TOKEN_STORAGE_KEY } from "../auth.storage-keys"
import { LocalTokenStorage } from "../LocalTokenStorage"

const createFakeToken = (exp: number) => {
  const payload = btoa(JSON.stringify({ exp }))
  return `header.${payload}.signature`
}

const NEW_FAKE_SECONDS = 1704067200

beforeEach(() => {
  localStorage.clear()
  vi.spyOn(Date, 'now').mockReturnValue(NEW_FAKE_SECONDS * 1000)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('LocalTokenStorage', () => {
  describe('save', () => {
    it('should save token to localStorage', async () => {
      const token = 'fake-access-token'
      await LocalTokenStorage.save(token)
      expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe(token)
    })

    it('should return null if there is no token saved', async () => {
      const result = LocalTokenStorage.getAccessToken()
      expect(result).toBeNull()
    })
  })

  describe('clear', () => {
    it('should remove token from localStorage', async () => {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'token-to-clear')
      await LocalTokenStorage.clear()
      expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull()
    })
  })

  describe('isTokenExpired', () => {
    it('should return false if token is not expired', () => {
      const futureExp = NEW_FAKE_SECONDS + 3600
      const token = createFakeToken(futureExp)

      const result = LocalTokenStorage.isTokenExpired(token)

      expect(result).toBe(false)
    })

    it('should be return true if token is expired', () => {
      const pastExp = NEW_FAKE_SECONDS - 3600
      const token = createFakeToken(pastExp)

      const result = LocalTokenStorage.isTokenExpired(token)
      expect(result).toBe(true)
    })

    it('should return true if token is malformed', () => {
      const malformedToken = 'malformed.token'
      const result = LocalTokenStorage.isTokenExpired(malformedToken)
      expect(result).toBe(true)
    })

    it('should true if token has no field exp', () => {
      const payload = btoa(JSON.stringify({ userId: '123' }))
      const tokenWithoutExp = `header.${payload}.signature`
      const result = LocalTokenStorage.isTokenExpired(tokenWithoutExp)
      expect(result).toBe(true)
    })
  })
})
