import { IGainsRepository } from '@/repositories/IGainsRepository'
import { GetGainsByDateUseCase } from './getGainsByDateUseCase'
import { gain, req } from '@tests/utils'
import { GetGainsByDateController } from './getGainsByDateController'
import { randomUUID } from 'crypto'

describe('GetGainsByDateController tests', () => {
  const getGainsByDateUseCase = new GetGainsByDateUseCase(
    {} as IGainsRepository
  )

  const getGainsByDateController = new GetGainsByDateController(
    getGainsByDateUseCase
  )

  beforeEach(() => {
    getGainsByDateUseCase.execute = jest
      .fn()
      .mockImplementation(({ ownerId, startDate, endDate }) => {
        if (ownerId !== gain.owner.id) return null

        if (startDate.getTime() > gain.createdAt.getTime()) return []

        if (endDate.getTime() < gain.createdAt.getTime()) return []

        return [gain.toJSON()]
      })

    req.headers.set('userId', gain.owner.id)
    req.json = jest.fn().mockResolvedValue({
      startDate: new Date(gain.createdAt.getTime() - 10),
      endDate: new Date(gain.createdAt.getTime() + 10)
    })
  })

  it('should return status 200 and gains', async () => {
    const res = await getGainsByDateController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.gains).toEqual([gain.toJSON()])
  })

  it('should return status 200 and gains if startDate is later than endDate', async () => {
    req.json = jest.fn().mockResolvedValue({
      startDate: new Date(gain.createdAt.getTime() + 10),
      endDate: new Date(gain.createdAt.getTime() - 10)
    })

    const res = await getGainsByDateController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.gains).toEqual([gain.toJSON()])
  })

  it('should return status 403 if not userId is provided', async () => {
    req.headers.delete('userId')

    const res = await getGainsByDateController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(403)
    expect(body.error).toBe('user is not authenticated')
  })

  it('should return status 400 if an invalid userId is provided', async () => {
    req.headers.set('userId', 'invalid userId')

    const res = await getGainsByDateController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 400 if invalid dates are provided', async () => {
    req.json = jest
      .fn()
      .mockResolvedValue({ startDate: 'invalid date', endDate: 'invalid date' })

    const res = await getGainsByDateController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return 400 if startDate is not provided', async () => {
    req.json = jest.fn().mockResolvedValue({ endDate: new Date() })

    const res = await getGainsByDateController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return 400 if endDate is not provided', async () => {
    req.json = jest.fn().mockResolvedValue({ startDate: new Date() })

    const res = await getGainsByDateController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 404 if owner not exists', async () => {
    req.headers.set('userId', randomUUID())

    const res = await getGainsByDateController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBe('user not found')
  })

  it('should return status 500 if an error occurs', async () => {
    getGainsByDateUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    const res = await getGainsByDateController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toBe('an error occurs')
  })
})
