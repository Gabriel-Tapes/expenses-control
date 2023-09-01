import { Gain } from '@/models/gain'
import { IGainsRepository } from '../IGainsRepository'
import { query } from '@/infra/database'
import { EditGainDTO } from '@/types/DTO'
import Decimal from 'decimal.js'

export class PostgresGainsRepository implements IGainsRepository {
  async createGain(gain: Gain): Promise<void> {
    await query(
      'INSERT INTO gains (id, ownerId, value, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5)',
      {
        values: [
          gain.id,
          gain.ownerId,
          gain.value.toString(),
          gain.createdAt,
          gain.updatedAt
        ]
      }
    )
  }
  async getGain(ownerId: string, gainId: string): Promise<Gain | null> {
    const { rows } = await query(
      'SELECT value, createdAt, updatedAt FROM gains WHERE ownerId = $1 and id = $2',
      { values: [ownerId, gainId] }
    )

    if (rows.length === 0) return null

    const { value, createdat: createdAt, updatedat: updatedAt } = rows[0]

    return new Gain(
      { ownerId, value: new Decimal(value) },
      gainId,
      createdAt,
      updatedAt
    )
  }
  async getAllGains(ownerId: string): Promise<Gain[]> {
    const { rows } = await query(
      'SELECT id, value, createdAt, updatedAt FROM gains WHERE ownerId = $1',
      { values: [ownerId] }
    )

    return rows.map(
      ({ id, value, createdat: createdAt, updatedat: updatedAt }) =>
        new Gain(
          { ownerId, value: new Decimal(value) },
          id,
          createdAt,
          updatedAt
        )
    )
  }
  async getGainsByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Gain[]> {
    const { rows } = await query(
      `
        SELECT id, value, createdAt, updatedAt
        FROM gains
        WHERE
          ownerId = $1 AND
          createdAt >= $2 AND
          createdAt <= $3
      `,
      { values: [ownerId, startDate, endDate] }
    )

    return rows.map(
      ({ id, value, createdat: createdAt, updatedat: updatedAt }) =>
        new Gain(
          { ownerId, value: new Decimal(value) },
          id,
          createdAt,
          updatedAt
        )
    )
  }
  async editGain({ id, ownerId, value }: EditGainDTO): Promise<Gain | null> {
    const { rows } = await query(
      `
        UPDATE gains
        SET value = $3, updatedAt = NOW()
        WHERE id = $1 and ownerId = $2
        RETURNING createdAt, updatedAt
      `,
      {
        values: [id, ownerId, value.toString()]
      }
    )

    if (!rows[0].bool) return null

    const { createdat: createdAt, updatedat: updatedAt } = rows[0]

    return new Gain(
      { ownerId, value: new Decimal(value) },
      id,
      createdAt,
      updatedAt
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
