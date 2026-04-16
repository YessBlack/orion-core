import cors, { CorsOptions } from 'cors'

const parseAllowedOrigins = (): string[] => {
  const raw = process.env.CORS_ALLOWED_ORIGINS ?? ''
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)
}

const allowedOrigins = parseAllowedOrigins()

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('CORS origin not allowed'))
  },
  credentials: false,
  optionsSuccessStatus: 204
}

export const corsMiddleware = cors(corsOptions)
