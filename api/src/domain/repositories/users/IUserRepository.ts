import { User } from '@/domain/entities/users/User.js'

export type CreateUserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isDefault'> & {
  password: string
  passwordConfirm: string
}

export type UpdateUserDTO = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  login(email: string, password: string): Promise<User | null>
  list(): Promise<User[]>
  create(data: CreateUserDTO): Promise<User>
  update(id: string, data: UpdateUserDTO): Promise<User>
  remove(id: string): Promise<void>
}
