import { User } from '@/domain/entities/users/User.js'

export type CreateUserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUserDTO = Partial<CreateUserDTO>
export type RegisterUserDTO = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  authenticate(email: string, password: string): Promise<User | null>
  register(data: RegisterUserDTO): Promise<User>
  list(): Promise<User[]>
  create(data: CreateUserDTO): Promise<User>
  update(id: string, data: UpdateUserDTO): Promise<User>
  remove(id: string): Promise<void>
}
