import { describe, it, expect, vi, beforeEach } from "vitest"
import { authApiClient } from "../auth.api-client"
import { AuthApiRepository } from "../AuthApiRepository"

vi.mock("../auth.api-client", () => ({
  authApiClient: {
    post: vi.fn()
  }
}))

const mockPost = vi.mocked(authApiClient.post)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AuthApiRepository', () => {
  describe('login', () => {
    it('llama al endpoint correcto con email y password', async () => {
      mockPost.mockResolvedValue({
        data: {
          data: {
            accessToken: 'mocked-access-token',
            tokenType: 'Bearer',
            user: { id: '1', name: 'Test', email: 'test@test.com', role: 'admin' }
          }
        }
      })

      await AuthApiRepository.login('test@test.com', 'password123')

      expect(mockPost).toHaveBeenCalledWith(
        '/api/v1/auth/login',
        { email: 'test@test.com', password: 'password123' }
      )
    })

    it('retorna el LoginResult correctamente mapeado', async () => {
      const apiResponse = {
        accessToken: 'mock',
        tokenType: 'Bearer',
        user: { id: '1', name: 'Test', email: 'test@test.com', role: 'admin' }
      }

      mockPost.mockResolvedValue({ data: { data: apiResponse } })

      const result = await AuthApiRepository.login('test@test.com', '12345678')
      expect(result).toEqual(apiResponse)
    })

    it('lanza error si la API falla', async () => {
      mockPost.mockRejectedValue(new Error('Network error'))

      await expect(
        AuthApiRepository.login('test@test.com', '12345678')
      ).rejects.toThrow('Network error')
    })
  })

  describe('refresh', () => {
    it('llama al endpoint correcto', async () => {
      mockPost.mockResolvedValue({
        data: { data: { accessToken: 'new-token', tokenType: 'Bearer' } }
      })

      await AuthApiRepository.refresh()

      expect(mockPost).toHaveBeenCalledWith('/api/v1/auth/refresh')
    })

    it('retorna el RefreshResult correctamente', async () => {
      const apiResponse = { accessToken: 'new-token', tokenType: 'Bearer' }
      mockPost.mockResolvedValue({ data: { data: apiResponse } })

      const result = await AuthApiRepository.refresh()
      expect(result).toEqual(apiResponse)
    })
  })

  describe('logout', () => {
    it('llama al endpoint correcto', async () => {
      mockPost.mockResolvedValue({})

      await AuthApiRepository.logout()

      expect(mockPost).toHaveBeenCalledWith('/api/v1/auth/logout')
    })

    it('no lanza error en logout exitoso', async () => {
      mockPost.mockResolvedValue({})

      await expect(AuthApiRepository.logout()).resolves.not.toThrow()
    })
  })
})
