import { User } from '@/models/user'

export interface IUsersRepository {
  createUser(user: User): Promise<void>
  getUserById(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  editUser(editedUser: User): Promise<User | null>
  deleteUser(userId: string): Promise<void>
}
