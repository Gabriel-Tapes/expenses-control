import { User } from '@/models/user'
import { IUsersRepository } from '../IUsersRepository'
import { query } from '@/infra/database'
import { EditUserDTO } from '@/types/DTO'

export class PostgresUsersRepository implements IUsersRepository {
  async createUser(user: User): Promise<void> {
    await query(
      'INSERT INTO users (id, name, lastName, email, password, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      {
        values: [
          user.id,
          user.name,
          user.lastName,
          user.email,
          user.password,
          user.createdAt.toISOString(),
          user.updatedAt?.toISOString()
        ]
      }
    )
  }
  async getUserById(id: string): Promise<User | null> {
    const { rows } = await query(
      `
        SELECT name, lastName, email, password, createdAt, updatedAt
        FROM users
        WHERE id = $1
      `,
      {
        values: [id]
      }
    )

    if (rows.length === 0) return null

    const {
      name,
      lastname: lastName,
      email,
      password,
      createdat: createdAt,
      updatedat: updatedAt
    } = rows[0]

    return new User(
      { name, lastName, email, password },
      id,
      createdAt,
      updatedAt
    )
  }
  async getUserByEmail(email: string): Promise<User | null> {
    const { rows } = await query(
      `
        SELECT id, name, lastName, password, createdAt, updatedAt 
        FROM users
        WHERE email = $1
      `,
      {
        values: [email]
      }
    )

    if (rows.length === 0) return null

    const {
      id,
      name,
      lastname: lastName,
      password,
      createdat: createdAt,
      updatedat: updatedAt
    } = rows[0]

    console.info(rows[0])
    return new User(
      { name, lastName, email, password },
      id,
      createdAt,
      updatedAt
    )
  }
  async editUser({
    id,
    name,
    lastName,
    password
  }: EditUserDTO): Promise<User | null> {
    const { rows } = await query(
      `
        UPDATE users
        SET 
          name = COALESCE($2, name),
          lastName = COALESCE($3, lastName),
          password = COALESCE($4, password),
          updatedAt = NOW()
        WHERE id = $1
        RETURNING name, lastName, email, password, createdAt, updatedAt
      `,
      {
        values: [id, name, lastName, password]
      }
    )
    if (!rows[0].bool) return null

    const {
      name: editedName,
      lastname: editedLastName,
      email,
      password: editedPassword,
      createdat: createdAt,
      updatedat: updatedAt
    } = rows[0]

    return new User(
      {
        name: editedName,
        lastName: editedLastName,
        email,
        password: editedPassword
      },
      id,
      createdAt,
      updatedAt
    )
  }
  async deleteUser(userId: string): Promise<number> {
    const { rows } = await query(
      'DELETE FROM users WHERE id = $1 RETURNING 1',
      { values: [userId] }
    )

    if (rows.length === 0) return 1

    return 0
  }
}
