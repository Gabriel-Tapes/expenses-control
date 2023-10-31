import { IGainsRepository } from '@/repositories/IGainsRepository'
import { CreateGainUseCase } from './createGainUseCase'
import { CreateGainController } from './createGainController'
import { gain, req, res } from '@tests/utils'

describe('CreateGainController tests', () => {
  const gainsRepository = {} as IGainsRepository
  const createGainUseCase = new CreateGainUseCase(gainsRepository)
  const createGainController = new CreateGainController(createGainUseCase)

  beforeAll(() => {
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    createGainUseCase.execute = jest
      .fn()
      .mockResolvedValue({ error: 0, message: 'success', gain })

    req.headers['x-user-id'] = gain.owner.id
    req.body = { value: gain.value.toNumber() }
  })

  it('should return status 201 and gain', async () => {
    await createGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ gain })
  })

  it('should return status 404 if owner not exists in database', async () => {
    createGainUseCase.execute = jest.fn().mockResolvedValue({
      error: 1,
      message: 'user not found',
      gain: null
    })

    await createGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })

  it('should return status 400 if invalid userId is provided', async () => {
    req.headers['x-user-id'] = 'invalid userId'

    await createGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if invalid value is provided', async () => {
    req.body = { value: 'invalid value' }

    await createGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 403 if userId is not provided', async () => {
    req.headers['x-user-id'] = undefined

    await createGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if value is not provided', async () => {
    req.body = {}

    await createGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 500 if an error occurs', async () => {
    createGainUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    await createGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'an error occurs' })
  })
})
