import { ITokenStorage } from "../domain/ITokenStorage"
import { ACCESS_TOKEN_STORAGE_KEY } from "./auth.storage-keys"

export const LocalTokenStorage: ITokenStorage = {
  async save(accessToken: string): Promise<void> {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
  },

  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  },

  async clear(): Promise<void> {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  },
}
