import { type Client } from 'pg'
import { randomUUID } from 'node:crypto'
import Decimal from 'decimal.js'
import { Gain } from '@/models/gain'
import {
  PostgresGainsRepository,
  PostgresUsersRepository
} from '@/repositories/implementations'
import { getNewClient } from '@/infra/database'
import { User } from '@/models/user'

describe('PostgresGainsRepository tests', () => {
  const gainsRepository = new PostgresGainsRepository()
  const user = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  })
  const gain = new Gain({ owner: user, value: new Decimal(700) })

  let client: Client

  beforeAll(async () => {
    const usersRepository = new PostgresUsersRepository()

    await usersRepository.createUser(user)
    client = await getNewClient()
  })

  afterEach(async () => {
    await client.query('DELETE FROM gains')
  })

  afterAll(async () => {
    await client.query('DELETE FROM users')

    await client.end()
  })

  it('should create a gain', async () => {
    await gainsRepository.createGain(gain)

    const { rows } = await client.query(
      'SELECT value FROM gains WHERE id = $1 AND ownerId = $2 limit 1',
      [gain.id, gain.owner.id]
    )

    expect(rows.length).toBe(1)

    const { value } = rows[0]

    expect(value).toEqual(gain.value.toString())
  })

  it('should get gain by id', async () => {
    await gainsRepository.createGain(gain)

    const gottenGain = await gainsRepository.getGain(gain.owner.id, gain.id)

    expect(gottenGain).toEqual(gain)
  })

  it('should return null if an non-matching id is provided', async () => {
    await gainsRepository.createGain(gain)

    const gottenGain = await gainsRepository.getGain(
      gain.owner.id,
      randomUUID()
    )

    expect(gottenGain).toBeNull()
  })

  it('should return null if an non-matching ownerId is provided', async () => {
    await gainsRepository.createGain(gain)

    const gottenGain = await gainsRepository.getGain(randomUUID(), gain.id)

    expect(gottenGain).toBeNull()
  })

  it('should get all gains', async () => {
    await gainsRepository.createGain(gain)
    await gainsRepository.createGain(
      new Gain({
        owner: user,
        value: new Decimal(400)
      })
    )

    const gottenGains = await gainsRepository.getAllGains(gain.owner.id)

    expect(gottenGains.length).toBe(2)
    expect(gottenGains[1]).toEqual(gain)
  })

  it('should return an empty list if no gains are found', async () => {
    const gottenGains = await gainsRepository.getAllGains(gain.owner.id)

    expect(gottenGains).toEqual([])
  })

  it('should get gains by date period', async () => {
    await gainsRepository.createGain(gain)

    const gottenGains = await gainsRepository.getGainsByDatePeriod(
      gain.owner.id,
      new Date(gain.createdAt.getTime() - 10),
      new Date(gain.createdAt.getTime() + 10)
    )

    expect(gottenGains.length).toBe(1)
    expect(gottenGains[0]).toEqual(gain)
  })

  it('should return an empty list if not gains are found on data period', async () => {
    await gainsRepository.createGain(gain)

    const gottenGains = await gainsRepository.getGainsByDatePeriod(
      gain.owner.id,
      new Date(gain.createdAt.getTime() - 20),
      new Date(gain.createdAt.getTime() - 10)
    )

    expect(gottenGains.length).toBe(0)
  })

  it('should return an empty list if not gains are found for ownerId', async () => {
    await gainsRepository.createGain(gain)

    const gottenGains = await gainsRepository.getGainsByDatePeriod(
      randomUUID(),
      new Date(gain.createdAt.getTime() - 10),
      new Date(gain.createdAt.getTime() + 10)
    )

    expect(gottenGains.length).toBe(0)
  })

  it('should edit an gain', async () => {
    await gainsRepository.createGain(gain)

    const editedGain = await gainsRepository.editGain({
      id: gain.id,
      ownerId: gain.owner.id,
      value: new Decimal(500)
    })

    expect(editedGain).toBeTruthy()
    expect(editedGain?.value.toString()).toEqual(new Decimal(500).toString())
    expect(editedGain?.updatedAt).not.toEqual(gain.updatedAt)
  })

  it('should return null if a non-matching id is provided on editing', async () => {
    await gainsRepository.createGain(gain)

    const editedGain = await gainsRepository.editGain({
      id: randomUUID(),
      ownerId: gain.owner.id,
      value: new Decimal(50)
    })

    expect(editedGain).toBeNull()
  })

  it('should return null if a non-matching ownerId is provided on editing', async () => {
    await gainsRepository.createGain(gain)

    const editedGain = await gainsRepository.editGain({
      id: gain.id,
      ownerId: randomUUID(),
      value: new Decimal(50)
    })

    expect(editedGain).toBeNull()
  })

  it('should return 0 if gain found and deleted', async () => {
    await gainsRepository.createGain(gain)

    const error = await gainsRepository.deleteGain(gain.owner.id, gain.id)

    expect(error).toBe(0)
  })

  it('should return 1 if a non-matching id is provided on deleting', async () => {
    await gainsRepository.createGain(gain)

    const error = await gainsRepository.deleteGain(gain.owner.id, randomUUID())

    expect(error).toBe(1)
  })

  it('should return 1 if a non-matching ownerId is provided on deleting', async () => {
    await gainsRepository.createGain(gain)

    const error = await gainsRepository.deleteGain(randomUUID(), gain.id)

    expect(error).toBe(1)
  })
})
