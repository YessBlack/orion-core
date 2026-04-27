import { describe, expect, it, vi } from "vitest"
import { loginUseCase } from "../login.use-case"
import { UserRole, type LoginResult } from "../../domain/auth.types"
import type { AuthDependencies } from "../auth.dependencies"

const mockLoginResult: LoginResult = {
  accessToken: 'fake-token',
  tokenType: 'Bearer',
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    role: UserRole.Seller
  }
}

const mockDeps: AuthDependencies = {
  authRepository: {
    login: vi.fn().mockResolvedValue(mockLoginResult),
    logout: vi.fn(),
    refresh: vi.fn()
  },
  tokenStorage: {
    save: vi.fn(),
    clear: vi.fn(),
    getAccessToken: vi.fn(),
    isTokenExpired: vi.fn()
  }
}

describe("loginUseCase", () => {
  it("calls repository with correct email and password", async () => {
    const input = { email: 'test@test.com', password: '12345678' }

    await loginUseCase(input, mockDeps)

    expect(mockDeps.authRepository.login).toHaveBeenCalledWith(
      'test@test.com',
      '12345678'
    )
  })

  it("returns the repository result", async () => {
    const input = { email: 'test@test.com', password: '12345678' }

    const result = await loginUseCase(input, mockDeps)

    expect(result).toEqual(mockLoginResult)
  })
})
