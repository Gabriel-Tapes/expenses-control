import Decimal from 'decimal.js'
import { query } from '@/infra/database'
import { Gain } from '@/models/gain'
import { User } from '@/models/user'
import { EditGainDTO } from '@/types/DTO'

export async function editGain({
  id,
  ownerId,
  value
}: EditGainDTO): Promise<Gain | null> {
  const { rows } = await query(
    `
      UPDATE gains
      SET value = $3, updatedAt = NOW()
      WHERE id = $1 and ownerId = $2
      RETURNING
        (
          SELECT json_build_object(
            'id', users.id,
            'name', users.name,
            'lastName', users.lastname,
            'email', users.email,
            'password', users.password,
            'createdAt', users.createdat,
            'updatedAt', users.updatedat
          )
          FROM users
        ) as owner,
        createdAt, 
        updatedAt
    `,
    {
      values: [id, ownerId, value.toString()]
    }
  )

  if (rows.length === 0) return null

  const { owner, createdat: createdAt, updatedat: updatedAt } = rows[0]

  return new Gain(
    {
      owner: new User(
        {
          name: owner.name,
          lastName: owner.lastName,
          email: owner.email,
          password: owner.password
        },
        ownerId,
        new Date(owner.createdAt),
        new Date(owner.updatedAt)
      ),
      value: new Decimal(value)
    },
    id,
    new Date(createdAt),
    new Date(updatedAt)
  )
}
