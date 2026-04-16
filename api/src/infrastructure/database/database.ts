import PocketBase from 'pocketbase'

export const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'

export const pb = new PocketBase(POCKETBASE_URL)

export const authenticateDatabase = async () => {
  const superuserEmail = process.env.POCKETBASE_SUPERUSER_EMAIL
  const superuserPassword = process.env.POCKETBASE_SUPERUSER_PASSWORD

  if (!superuserEmail || !superuserPassword) {
    throw new Error('Missing PocketBase superuser credentials in environment variables')
  }

  await pb.collection('_superusers').authWithPassword(superuserEmail, superuserPassword)
}
