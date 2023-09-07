import { createGainController } from '@/controllers/createGain'
import {
  PostgresGainsRepository,
  PostgresUsersRepository
} from '@/repositories/implementations'
import { gain, req } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('CreateGainController tests', () => {
  const usersRepository = new PostgresUsersRepository()
  const gainsRepository = new PostgresGainsRepository()

  beforeAll(async () => {
    await usersRepository.createUser(gain.owner)
  })

  beforeEach(() => {
    req.headers.set('userId', gain.owner.id)
    req.json = jest.fn().mockResolvedValue({ value: gain.value.toNumber() })
  })

  afterEach(async () => {
    gainsRepository.deleteGain(gain.owner.id, gain.id)
  })

  afterAll(async () => {
    usersRepository.deleteUser(gain.owner.id)
  })

  it('should return status 201 and gain', async () => {
    const res = await createGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.gain.value).toEqual(gain.value.toString())
    expect(body.gain.owner).toEqual(gain.owner.toJSON())
  })

  it('should return status 404 if owner not exists in database', async () => {
    req.headers.set('userId', randomUUID())

    const res = await createGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBe('owner not found')
  })

  it('should return status 400 if invalid userId is provided', async () => {
    req.headers.set('userId', 'invalid userId')

    const res = await createGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 400 if invalid value is provided', async () => {
    req.json = jest.fn().mockResolvedValue({ value: 'invalid value' })

    const res = await createGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 403 if userId is not provided', async () => {
    req.headers.delete('userId')

    const res = await createGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(403)
    expect(body.error).toBeTruthy()
  })

  it('should return status 400 if value is not provided', async () => {
    req.json = jest.fn().mockResolvedValue({})

    const res = await createGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })
})
