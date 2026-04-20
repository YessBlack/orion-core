export interface ITokenStorage {
  save(accessToken: string): Promise<void>
  getAccessToken(): Promise<string | null>
  clear(): Promise<void>
}
