import { query } from '@/infra/database'
import { User } from '@/models/user'

export async function getUserById(id: string): Promise<User | null> {
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

  return new User({ name, lastName, email, password }, id, createdAt, updatedAt)
}
