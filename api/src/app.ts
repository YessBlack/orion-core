import express from 'express'
import { rootRouter } from '@/presentation/http/routes/index.js'
import { ErrorCode } from './presentation/http/shared/constants.js'
import { globalLimiter } from './presentation/http/middleware/rate-limit.middleware.js'
import helmet from 'helmet'
import { corsMiddleware } from './presentation/http/middleware/cors.middleware.js'
import cookieParser from 'cookie-parser'

const app = express()

app.disable('x-powered-by')

app.use(cookieParser())
app.use(corsMiddleware)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))
app.use(express.json({ limit: '100kb' }))
app.use(globalLimiter)
app.use(rootRouter)

app.get('/', (_req, res) => {
  return res.status(200).json({
    data: {
      name: 'orion-core-api',
      status: 'ok'
    }
  })
})

app.get('/health', (_req, res) => {
  return res.status(200).json({ data: { status: 'ok' } })
})

app.use((_req, res) => {
  return res.status(404).json({
    error: {
      code: ErrorCode.NotFound,
      message: 'Route not found'
    }
  })
})

export default app
