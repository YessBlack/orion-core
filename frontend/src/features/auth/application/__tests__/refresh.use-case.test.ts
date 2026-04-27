import { describe, it, expect, vi } from 'vitest'
import { AuthDependencies } from '../auth.dependencies'
import { refreshUseCase } from '../refresh.use-case'
import { RefreshResult } from '../../domain/auth.types'

const mockRefreshResult: RefreshResult = {
  accessToken: 'new-fake-token',
  tokenType: 'Bearer',
  expiresIn: 7200,
  expiresAt: '2024-01-01T00:00:00.000Z',
  refreshTokenExpiresIn: 604800,
  refreshTokenExpiresAt: '2024-01-08T00:00:00.000Z'
}

const mockDeps: AuthDependencies = {
  authRepository: {
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn().mockResolvedValue(mockRefreshResult)
  },
  tokenStorage: {
    save: vi.fn(),
    clear: vi.fn(),
    getAccessToken: vi.fn(),
    isTokenExpired: vi.fn()
  }
}

describe("refreshUseCase", () => {
  it("calls the refresh repository", async () => {
    await refreshUseCase(mockDeps)

    expect(mockDeps.authRepository.refresh).toHaveBeenCalled()
  })

  it("stores the new token in storage", async () => {
    await refreshUseCase(mockDeps)

    expect(mockDeps.tokenStorage.save).toHaveBeenCalledWith("new-fake-token")
  })

  it("returns the repository result", async () => {
    const result = await refreshUseCase(mockDeps)

    expect(result).toEqual(mockRefreshResult)
  })
})
