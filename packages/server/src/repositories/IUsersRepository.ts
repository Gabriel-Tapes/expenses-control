import { type User } from '@/models/user'
import { type EditUserDTO } from '@/types/DTO'

export interface IUsersRepository {
  createUser(user: User): Promise<void>
  getUserById(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  editUser({ id, name, lastName, password }: EditUserDTO): Promise<User | null>
  deleteUser(userId: string): Promise<number>
}
