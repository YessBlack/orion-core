import { User, UserRole } from '@/domain/entities/users/User.js'

export type CreateUserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUserDTO = Partial<CreateUserDTO>

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  countByRole(role: UserRole): Promise<number>
  create(data: CreateUserDTO): Promise<User>
  update(id: string, data: UpdateUserDTO): Promise<User>
  delete(id: string): Promise<void>
}
