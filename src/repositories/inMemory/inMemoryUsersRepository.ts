import { User } from '@/models/user'
import { IUsersRepository } from '../IUsersRepository'

export class InMemoryUsersRepository implements IUsersRepository {
  private data: User[]

  constructor() {
    this.data = []
  }
  async createUser(user: User): Promise<void> {
    this.data.push(
      new User(
        {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          password: user.password
        },
        user.id,
        user.createdAt,
        user.updatedAt
      )
    )
  }
  async getUserById(id: string): Promise<User | null> {
    const index = this.data.findIndex(user => user.id === id)

    return this.data[index]
  }
  async getUserByEmail(email: string): Promise<User | null> {
    const index = this.data.findIndex(user => user.email === email)

    return this.data[index]
  }
  async editUser({
    id,
    name,
    lastName,
    password
  }: {
    id: string
    name?: string | undefined
    lastName?: string | undefined
    password?: string | undefined
  }): Promise<User | null> {
    const index = this.data.findIndex(user => user.id === id)

    if (index === -1) return null

    this.data[index].name = name ?? this.data[index].name
    this.data[index].lastName = lastName ?? this.data[index].lastName
    this.data[index].password = password ?? this.data[index].password
    this.data[index].updatedAt = new Date()

    return this.data[index]
  }
  async deleteUser(userId: string): Promise<number> {
    const initialLength = this.data.length

    this.data = this.data.filter(user => user.id !== userId)

    if (this.data.length > initialLength) return 1

    return 0
  }
}
