import { IUsersRepository } from '@/repositories/IUsersRepository'
import {
  createUser,
  getUserById,
  getUserByEmail,
  editUser,
  deleteUser
} from './methods'
import { User } from '@/models/user'
import { EditUserDTO } from '@/types/DTO'

export class PostgresUsersRepository implements IUsersRepository {
  createUser(user: User): Promise<void> {
    return createUser(user)
  }
  getUserById(id: string): Promise<User | null> {
    return getUserById(id)
  }
  getUserByEmail(email: string): Promise<User | null> {
    return getUserByEmail(email)
  }
  editUser(params: EditUserDTO): Promise<User | null> {
    return editUser({ ...params })
  }
  deleteUser(userId: string): Promise<number> {
    return deleteUser(userId)
  }
}
