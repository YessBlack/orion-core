import 'dotenv/config'
import { authenticateDatabase } from '@/infrastructure/database/database.js'
import app from './app.js'

const PORT = Number(process.env.PORT ?? 3000)

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
