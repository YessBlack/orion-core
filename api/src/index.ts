import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { authenticateDatabase } from '@/infrastructure/database/database.js'
import { rootRouter } from '@/presentation/http/routes/index.js'
import { ErrorCode } from './presentation/http/shared/constants.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT ?? 3000)

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

const bootstrap = async () => {
  await authenticateDatabase()

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
  })
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap API', error)
  process.exit(1)
})
