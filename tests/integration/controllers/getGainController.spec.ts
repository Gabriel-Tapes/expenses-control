import { getGainController } from '@/controllers/getGain'
import {
  PostgresGainsRepository,
  PostgresUsersRepository
} from '@/repositories/implementations'
import { gain, req } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('GetGainController integration tests', () => {
  const usersRepository = new PostgresUsersRepository()
  const gainsRepository = new PostgresGainsRepository()

  beforeAll(async () => {
    await usersRepository.createUser(gain.owner)
    await gainsRepository.createGain(gain)
  })

  beforeEach(() => {
    req.headers.set('userId', gain.owner.id)
  })

  afterAll(async () => {
    await usersRepository.deleteUser(gain.owner.id)
  })

  it('should return status 200 and gain', async () => {
    req.json = jest.fn().mockResolvedValue({ id: gain.id })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.gain).toEqual(gain.toJSON())
  })

  it('should return status 403 if ownerId is not provided', async () => {
    req.headers.delete('userId')
    req.json = jest.fn().mockResolvedValue({ id: gain.id })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(403)
    expect(body.error).toBeTruthy()
  })

  it('should return status 404 if a non-matching ownerId is provided', async () => {
    req.headers.set('userId', randomUUID())
    req.json = jest.fn().mockResolvedValue({ id: gain.id })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBeTruthy()
  })

  it('should return status 404 if a non-matching gainId is provided', async () => {
    req.json = jest.fn().mockResolvedValue({ id: randomUUID() })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBeTruthy()
  })

  it('should return status 400 if gainId is not provided', async () => {
    req.json = jest.fn().mockResolvedValue({})

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 400 if a invalid ownerId is provided', async () => {
    req.headers.set('userId', 'invalid ownerId')
    req.json = jest.fn().mockResolvedValue({ id: gain.id })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 400 if a invalid gainId is provided', async () => {
    req.json = jest.fn().mockResolvedValue({ id: 'invalid gainId' })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })
})
