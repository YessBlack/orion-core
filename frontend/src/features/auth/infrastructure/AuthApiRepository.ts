import { IAuthRepository } from "../domain/IAuthRepository"
import { LoginResult, RefreshResult } from "../domain/auth.types"
import { authApiClient } from "./auth.api-client"

type ApiDataResponse<T> = {
  data: T
}

const login = async (email: string, password: string): Promise<LoginResult> => {
  const response = await authApiClient.post<ApiDataResponse<LoginResult>>(
    "/api/v1/auth/login",
    { email, password }
  )

  return response.data.data
}

const refresh = async (): Promise<RefreshResult> => {
  const response = await authApiClient.post<ApiDataResponse<RefreshResult>>(
    "/api/v1/auth/refresh"
  )
  return response.data.data
}

const logout = async (): Promise<void> => {
  await authApiClient.post("/api/v1/auth/logout")
}

export const AuthApiRepository: IAuthRepository = {
  login,
  refresh,
  logout,
}
