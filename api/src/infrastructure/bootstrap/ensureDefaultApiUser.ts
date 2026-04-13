import { AppModule, UserPermission } from '@/domain/entities/users/UserPermission.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'
import { AccessLevel } from '@/domain/shared/AccessLevel.js'
import { pb } from '@/infrastructure/database/database.js'

const USER_COLLECTION = 'users'

export const ensureDefaultApiUser = async () => {
  const enabled = process.env.ENABLE_DEFAULT_API_USER === 'true'
  const isProduction = process.env.NODE_ENV === 'production'

  if (!enabled || isProduction) {
    return
  }

  const email = process.env.DEFAULT_API_USER_EMAIL ?? 'admin-api@orion.local'
  const password = process.env.DEFAULT_API_USER_PASSWORD ?? 'orion-local-admin-123'
  const name = process.env.DEFAULT_API_USER_NAME ?? 'Local API Admin'

  const expectedPermissions: UserPermission[] = [
    { module: AppModule.Users, level: AccessLevel.Admin }
  ]

  try {
    const existing = await pb.collection(USER_COLLECTION).getFirstListItem(`email="${email}"`)

    const shouldRepairRole = existing.role !== UserRole.Admin
    const shouldRepairApiAccess = existing.apiAccessLevel !== AccessLevel.Admin
    const shouldRepairPermissions = !Array.isArray(existing.permissions)

    if (shouldRepairRole || shouldRepairApiAccess || shouldRepairPermissions) {
      await pb.collection(USER_COLLECTION).update(existing.id, {
        role: UserRole.Admin,
        apiAccessLevel: AccessLevel.Admin,
        permissions: expectedPermissions,
        isActive: true
      })

      console.log(`[bootstrap] Default API user repaired: ${email}`)
    }
  } catch {
    await pb.collection(USER_COLLECTION).create({
      name,
      email,
      password,
      passwordConfirm: password,
      role: UserRole.Admin,
      apiAccessLevel: AccessLevel.Admin,
      permissions: expectedPermissions,
      isDefault: true,
      isActive: true
    })

    console.log(`[bootstrap] Default API user created: ${email}`)
  }
}
