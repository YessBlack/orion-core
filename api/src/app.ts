import cors from 'cors'
import express from 'express'
import { rootRouter } from '@/presentation/http/routes/index.js'
import { ErrorCode } from './presentation/http/shared/constants.js'

const app = express()

app.use(cors())
app.use(express.json())
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
