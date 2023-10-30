import { query } from '@/infra/database'
import { Gain } from '@/models/gain'

export async function createGain(gain: Gain): Promise<void> {
  await query(
    'INSERT INTO gains (id, ownerId, value, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5)',
    {
      values: [
        gain.id,
        gain.owner.id,
        gain.value.toString(),
        gain.createdAt,
        gain.updatedAt
      ]
    }
  )
}
