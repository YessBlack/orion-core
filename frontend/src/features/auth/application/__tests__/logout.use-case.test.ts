import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthDependencies } from '../auth.dependencies'
import { logoutUseCase } from '../logout.use-case'

const mockDeps: AuthDependencies = {
  authRepository: {
    login: vi.fn(),
    logout: vi.fn().mockResolvedValue(undefined),
    refresh: vi.fn()
  },
  tokenStorage: {
    save: vi.fn(),
    clear: vi.fn().mockResolvedValue(undefined),
    getAccessToken: vi.fn(),
    isTokenExpired: vi.fn()
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("logoutUseCase", () => {
  it("calls the logout repository", async () => {
    await logoutUseCase(mockDeps)

    expect(mockDeps.authRepository.logout).toHaveBeenCalled()
  })

  it("clears storage after a successful logout", async () => {
    await logoutUseCase(mockDeps)

    expect(mockDeps.tokenStorage.clear).toHaveBeenCalled()
  })

  it("clears storage even if the server fails", async () => {
    mockDeps.authRepository.logout = vi.fn().mockRejectedValue(
      new Error("Server error")
    )

    await expect(logoutUseCase(mockDeps)).rejects.toThrow("Server error")

    expect(mockDeps.tokenStorage.clear).toHaveBeenCalled()
  })
})
