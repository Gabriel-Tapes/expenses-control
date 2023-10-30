import { query } from '@/infra/database'

export async function deleteUser(userId: string): Promise<number> {
  const { rows } = await query('DELETE FROM users WHERE id = $1 RETURNING 1', {
    values: [userId]
  })

  if (rows.length === 0) return 1

  return 0
}
