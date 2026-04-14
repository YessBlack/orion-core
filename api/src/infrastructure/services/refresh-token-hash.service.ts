import crypto from 'node:crypto'

const REFRESH_TOKEN_PEPPER = process.env.REFRESH_TOKEN_PEPPER || 'local-refresh-token-pepper'

export const hashRefreshToken = async (token: string): Promise<string> => {
  return crypto
    .createHash('sha256')
    .update(`${token}.${REFRESH_TOKEN_PEPPER}`)
    .digest('hex')
}
