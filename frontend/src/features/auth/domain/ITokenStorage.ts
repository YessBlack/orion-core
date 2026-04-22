export interface ITokenStorage {
  save(accessToken: string): Promise<void>
  getAccessToken(): string | null
  clear(): Promise<void>
  isTokenExpired(token: string): boolean
}
