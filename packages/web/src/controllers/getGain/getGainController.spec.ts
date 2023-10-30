import { IGainsRepository } from '@/repositories/IGainsRepository'
import { GetGainUseCase } from './getGainUseCase'
import { GetGainController } from './getGainController'
import { gain, req } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('GetGainController tests', () => {
  const getGainUseCase = new GetGainUseCase({} as IGainsRepository)
  const getGainController = new GetGainController(getGainUseCase)

  beforeEach(() => {
    getGainUseCase.execute = jest.fn().mockImplementation(({ ownerId, id }) => {
      if (ownerId === gain.owner.id && id === gain.id) return gain

      return null
    })

    req.headers.set('userId', gain.owner.id)
  })

  it('should return status 200 and gain', async () => {
    req.json = jest.fn().mockResolvedValue({ id: gain.id })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.gain).toEqual(gain.toJSON())
  })

  it('should return status 404 if a non-matching ownerId', async () => {
    req.headers.set('userId', randomUUID())
    req.json = jest.fn().mockResolvedValue({ id: gain.id })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBeTruthy()
  })

  it('should return status 404 if a non-matching id', async () => {
    req.json = jest.fn().mockResolvedValue({ id: randomUUID() })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBeTruthy()
  })

  it('should return status 403 if ownerId is not provided', async () => {
    req.headers.delete('userId')
    req.json = jest.fn().mockResolvedValue({ id: gain.id })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(403)
    expect(body.error).toBeTruthy()
  })

  it('should return status 400 if an invalid ownerId is provided', async () => {
    req.headers.set('userId', 'invalid owner id')
    req.json = jest.fn().mockResolvedValue({ id: gain.id })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 400 if an invalid gainId is provided', async () => {
    req.json = jest.fn().mockResolvedValue({ id: 'invalid gainId' })

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 400 if gainId is not provided', async () => {
    req.json = jest.fn().mockResolvedValue({})

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body).toBeTruthy()
  })

  it('should return status 500 if an error occurs', async () => {
    req.json = jest.fn().mockResolvedValue({ id: gain.id })
    getGainUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    const res = await getGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toBe('an error occurs')
  })
})
