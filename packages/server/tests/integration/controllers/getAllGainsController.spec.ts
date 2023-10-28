import { getAllGainsController } from '@/controllers/getAllGains'
import {
  PostgresGainsRepository,
  PostgresUsersRepository
} from '@/repositories/implementations'
import { gain, req } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('GetAllGainsController tests', () => {
  const usersRepository = new PostgresUsersRepository()
  const gainsRepository = new PostgresGainsRepository()
  beforeAll(async () => {
    await usersRepository.createUser(gain.owner)
    await gainsRepository.createGain(gain)
  })

  afterAll(async () => {
    await usersRepository.deleteUser(gain.owner.id)
  })

  beforeEach(() => {
    req.headers.set('userId', gain.owner.id)
  })

  it('should return status 200 and gains', async () => {
    const res = await getAllGainsController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.gains).toEqual([gain.toJSON()])
  })

  it('should return status 404 if owner not found', async () => {
    req.headers.set('userId', randomUUID())
    const res = await getAllGainsController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBe('owner not found')
  })

  it('should return status 400 if an invalid userId is provided', async () => {
    req.headers.set('userId', 'invalid userId')

    const res = await getAllGainsController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 403 if userId is not provided', async () => {
    req.headers.delete('userId')

    const res = await getAllGainsController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(403)
    expect(body.error).toBeTruthy()
  })
})
