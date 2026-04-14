import { Session } from '@/domain/entities/users/Session.js'

export type CreateSessionDTO = Omit<Session, 'id' | 'createdAt'>

export interface ISessionRepository {
  create: (data: CreateSessionDTO) => Promise<Session>
  findActiveByHash: (refreshTokenHash: string) => Promise<Session | null>
  revokeById: (id: string) => Promise<void>
  revokeAllByUserId: (id: string) => Promise<void>
}
