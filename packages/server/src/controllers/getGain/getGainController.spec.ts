import { IGainsRepository } from '@/repositories/IGainsRepository'
import { GetGainUseCase } from './getGainUseCase'
import { GetGainController } from './getGainController'
import { gain, req, res } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('GetGainController tests', () => {
  const getGainUseCase = new GetGainUseCase({} as IGainsRepository)
  const getGainController = new GetGainController(getGainUseCase)

  beforeAll(() => {
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    getGainUseCase.execute = jest.fn().mockImplementation(({ ownerId, id }) => {
      if (ownerId === gain.owner.id && id === gain.id) return gain

      return null
    })

    req.headers['x-user-id'] = gain.owner.id
  })

  it('should return status 200 and gain', async () => {
    req.body = { id: gain.id }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ gain })
  })

  it('should return status 404 if a non-matching ownerId', async () => {
    req.headers['x-user-id'] = randomUUID()
    req.body = { id: gain.id }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 404 if a non-matching id', async () => {
    req.body = { id: randomUUID() }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 403 if ownerId is not provided', async () => {
    req.headers['x-user-id'] = undefined
    req.body = { id: gain.id }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if an invalid ownerId is provided', async () => {
    req.headers['x-user-id'] = 'invalid owner id'
    req.body = { id: gain.id }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if an invalid gainId is provided', async () => {
    req.body = { id: 'invalid gainId' }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if gainId is not provided', async () => {
    req.body = {}

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 500 if an error occurs', async () => {
    req.body = { id: gain.id }
    getGainUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'an error occurs' })
  })
})
