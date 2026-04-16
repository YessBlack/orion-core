import crypto from 'node:crypto'

const readRequiredEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error('Missing required environment variable: ' + name)
  }
  return value
}

const REFRESH_TOKEN_PEPPER = readRequiredEnv('REFRESH_TOKEN_PEPPER')

export const hashRefreshToken = async (token: string): Promise<string> => {
  return crypto
    .createHash('sha256')
    .update(token + '.' + REFRESH_TOKEN_PEPPER)
    .digest('hex')
}
