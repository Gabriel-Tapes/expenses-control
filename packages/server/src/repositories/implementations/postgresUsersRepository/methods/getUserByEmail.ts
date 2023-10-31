import { query } from '@/infra/database'
import { User } from '@/models/user'

export async function getUserByEmail(email: string): Promise<User | null> {
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

  return new User({ name, lastName, email, password }, id, createdAt, updatedAt)
}
