import { ITokenStorage } from "../domain/ITokenStorage"
import { ACCESS_TOKEN_STORAGE_KEY } from "./auth.storage-keys"

const save = async (accessToken: string): Promise<void> => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
}

const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

const clear = async (): Promise<void> => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1]
    if (!payloadBase64) return true

    const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"))
    const payload = JSON.parse(payloadJson) as { exp?: number }

    if (!payload.exp) return true

    const nowInSeconds = Math.floor(Date.now() / 1000)
    return payload.exp <= nowInSeconds
  } catch {
    return true
  }
}

export const LocalTokenStorage: ITokenStorage = {
  save,
  clear,
  getAccessToken,
  isTokenExpired
}
