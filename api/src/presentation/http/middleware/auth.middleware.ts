import { TokenService } from '@/application/services/token.service.js'
import { AppModule } from '@/domain/entities/users/UserPermission.js'
import { UserRole } from '@/domain/entities/users/UserRole.js'
import { AccessLevel } from '@/domain/shared/AccessLevel.js'
import { Request, Response, NextFunction } from 'express'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: {
        userId: string
        role: UserRole
        apiAccessLevel: AccessLevel
        permissions: Array<{ module: AppModule, level: AccessLevel }>
      }
    }
  }
}

export const createAuthMiddleware = (tokenService: TokenService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'Missing token' })
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid format' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const auth = tokenService.validate(token)

      req.auth = auth

      next()
    } catch {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}

export const requireRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    next()
  }
}

const API_ACCESS_LEVELS = new Set<AccessLevel>([
  AccessLevel.Read,
  AccessLevel.Write,
  AccessLevel.Admin
])

export const requireApiAccess = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const hasApiAccess = API_ACCESS_LEVELS.has(req.auth.apiAccessLevel)

    if (!hasApiAccess) {
      return res.status(403).json({ message: 'API access required' })
    }

    next()
  }
}
