import Decimal from 'decimal.js'
import { query } from '@/infra/database'
import { IGainsRepository } from '../IGainsRepository'
import { Gain } from '@/models/gain'
import { EditGainDTO } from '@/types/DTO'
import { User } from '@/models/user'

export class PostgresGainsRepository implements IGainsRepository {
  async createGain(gain: Gain): Promise<void> {
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
  async getGain(ownerId: string, gainId: string): Promise<Gain | null> {
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
  async getAllGains(ownerId: string): Promise<Gain[]> {
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
  async getGainsByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Gain[]> {
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
        WHERE
          gains.ownerId = $1 AND
          gains.createdAt BETWEEN $2 AND $3
        ORDER BY gains.createdAt DESC
      `,
      { values: [ownerId, startDate, endDate] }
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
  async editGain({ id, ownerId, value }: EditGainDTO): Promise<Gain | null> {
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
  async deleteGain(ownerId: string, gainId: string): Promise<number> {
    const { rows } = await query(
      'DELETE FROM gains WHERE ownerId = $1 and id = $2 RETURNING 1',
      {
        values: [ownerId, gainId]
      }
    )

    if (rows.length === 0) return 1

    return 0
  }
}
