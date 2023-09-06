import Decimal from 'decimal.js'
import { query } from '@/infra/database'
import { Gain } from '@/models/gain'
import { User } from '@/models/user'

export async function getAllGains(ownerId: string): Promise<Gain[]> {
  const { rows } = await query(
    `
      SELECT
        json_build_object(
          'id', gains.id,
          'owner', json_build_object(
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
        ) as gain
      FROM gains
      INNER JOIN users
        ON gains.ownerId = users.id
      WHERE gains.ownerId = $1
      ORDER BY gains.createdAt DESC
    `,
    { values: [ownerId] }
  )

  return rows.map(({ gain }) => {
    const { id, owner, value, createdAt, updatedAt } = gain
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
  })
}
