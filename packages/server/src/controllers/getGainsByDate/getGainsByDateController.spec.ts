import { IGainsRepository } from '@/repositories/IGainsRepository'
import { GetGainsByDateUseCase } from './getGainsByDateUseCase'
import { gain, req, res } from '@tests/utils'
import { GetGainsByDateController } from './getGainsByDateController'
import { randomUUID } from 'crypto'

describe('GetGainsByDateController tests', () => {
  const getGainsByDateUseCase = new GetGainsByDateUseCase(
    {} as IGainsRepository
  )

  const getGainsByDateController = new GetGainsByDateController(
    getGainsByDateUseCase
  )

  beforeAll(() => {
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    getGainsByDateUseCase.execute = jest
      .fn()
      .mockImplementation(({ ownerId, startDate, endDate }) => {
        if (ownerId !== gain.owner.id) return null

        if (startDate.getTime() > gain.createdAt.getTime()) return []

        if (endDate.getTime() < gain.createdAt.getTime()) return []

        return [gain.toJSON()]
      })

    req.headers['x-user-id'] = gain.owner.id
    req.body = {
      startDate: new Date(gain.createdAt.getTime() - 10),
      endDate: new Date(gain.createdAt.getTime() + 10)
    }
  })

  it('should return status 200 and gains', async () => {
    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ gains: [gain.toJSON()] })
  })

  it('should return status 200 and gains if startDate is later than endDate', async () => {
    req.body = {
      startDate: new Date(gain.createdAt.getTime() + 10),
      endDate: new Date(gain.createdAt.getTime() - 10)
    }

    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ gains: [gain.toJSON()] })
  })

  it('should return status 403 if not userId is provided', async () => {
    req.headers['x-user-id'] = undefined

    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      error: 'user is not authenticated'
    })
  })

  it('should return status 400 if an invalid userId is provided', async () => {
    req.headers['x-user-id'] = 'invalid userId'

    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if invalid dates are provided', async () => {
    req.body = { startDate: 'invalid date', endDate: 'invalid date' }

    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return 400 if startDate is not provided', async () => {
    req.body = { endDate: new Date() }

    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return 400 if endDate is not provided', async () => {
    req.body = { startDate: new Date() }

    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 404 if owner not exists', async () => {
    req.headers['x-user-id'] = randomUUID()

    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })

  it('should return status 500 if an error occurs', async () => {
    getGainsByDateUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'an error occurs' })
  })
})
