import { IGainsRepository } from '@/repositories/IGainsRepository'
import { GetAllGainsUseCase } from './getAllGainsUseCase'
import { GetAllGainsController } from './getAllGainsController'
import { gain, req, res } from '@tests/utils'

describe('GetAllGainsController tests', () => {
  const getAllGainsUseCase = new GetAllGainsUseCase({} as IGainsRepository)
  const getAllGainsController = new GetAllGainsController(getAllGainsUseCase)

  beforeAll(() => {
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    req.headers['x-user-id'] = gain.owner.id
    getAllGainsUseCase.execute = jest.fn().mockResolvedValue([gain.toJSON()])
  })

  it('should return status 200 and gains', async () => {
    await getAllGainsController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ gains: [gain.toJSON()] })
  })

  it('should return status 404 if owner not found', async () => {
    getAllGainsUseCase.execute = jest.fn().mockResolvedValue(null)

    await getAllGainsController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'owner not found' })
  })

  it('should return status 400 if an invalid userId is provided', async () => {
    req.headers['x-user-id'] = 'invalid userId'

    await getAllGainsController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 403 if userId is not provided', async () => {
    req.headers['x-user-id'] = undefined

    await getAllGainsController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 500 if an error occurs', async () => {
    getAllGainsUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    await getAllGainsController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'an error occurs' })
  })
})
