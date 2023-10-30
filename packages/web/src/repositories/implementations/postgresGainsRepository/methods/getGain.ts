import Decimal from 'decimal.js'
import { query } from '@/infra/database'
import { Gain } from '@/models/gain'
import { User } from '@/models/user'

export async function getGain(
  ownerId: string,
  gainId: string
): Promise<Gain | null> {
  const { rows } = await query(
    `
      SELECT
        json_build_object(
          'id', gains.id,
          'owner', json_build_object(
            'id', users.id,
            'name', users.name,
            'lastName', users.lastname,
            'email', users.email,
            'password', users.password,
            'createdAt', users.createdAt,
            'updatedAt', users.updatedAt
          ),
          'value', gains.value,
          'createdAt', gains.createdAt,
          'updatedAt', gains.updatedAt
        ) AS gain
      FROM gains
      INNER JOIN users
        ON gains.ownerId = users.id
      WHERE gains.ownerId = $1 and gains.id = $2
      LIMIT 1
    `,
    { values: [ownerId, gainId] }
  )

  if (rows.length === 0) return null

  const { owner, value, createdAt, updatedAt } = rows[0].gain

  return new Gain(
    {
      owner: new User(
        {
          name: owner.name,
          lastName: owner.lastName,
          email: owner.email,
          password: owner.password
        },
        owner.id,
        new Date(owner.createdAt),
        new Date(owner.updatedAt)
      ),
      value: new Decimal(value)
    },
    gainId,
    new Date(createdAt),
    new Date(updatedAt)
  )
}
