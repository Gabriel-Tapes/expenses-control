import { query } from '@/infra/database'

export async function deleteGain(
  ownerId: string,
  gainId: string
): Promise<number> {
  const { rows } = await query(
    'DELETE FROM gains WHERE ownerId = $1 and id = $2 RETURNING 1',
    {
      values: [ownerId, gainId]
    }
  )

  if (rows.length === 0) return 1

  return 0
}
