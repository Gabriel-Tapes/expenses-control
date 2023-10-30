import { query } from '@/infra/database'
import { User } from '@/models/user'

export async function getOwner(ownerId: string): Promise<User | null> {
  const { rows } = await query(
    `
      SELECT json_build_object(
        'name', name,
        'lastName', lastname,
        'email', email,
        'password', password,
        'createdAt', createdat,
        'updatedAt', updatedat
      ) as user
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    { values: [ownerId] }
  )

  if (rows.length === 0) return null

  const { name, lastName, email, password, createdAt, updatedAt } = rows[0].user

  return new User(
    { name, lastName, email, password },
    ownerId,
    new Date(createdAt),
    new Date(updatedAt)
  )
}
