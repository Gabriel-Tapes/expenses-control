import { query } from '@/infra/database'
import { User } from '@/models/user'

export async function createUser(user: User): Promise<void> {
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
