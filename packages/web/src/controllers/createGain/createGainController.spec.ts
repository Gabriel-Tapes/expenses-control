import { IGainsRepository } from '@/repositories/IGainsRepository'
import { CreateGainUseCase } from './createGainUseCase'
import { CreateGainController } from './createGainController'
import { gain, req } from '@tests/utils'

describe('CreateGainController tests', () => {
  const gainsRepository = {} as IGainsRepository
  const createGainUseCase = new CreateGainUseCase(gainsRepository)
  const createGainController = new CreateGainController(createGainUseCase)

  beforeEach(() => {
    createGainUseCase.execute = jest
      .fn()
      .mockResolvedValue({ error: 0, message: 'success', gain })

    req.headers.set('userId', gain.owner.id)
    req.json = jest.fn().mockResolvedValue({ value: gain.value.toNumber() })
  })

  it('should return status 201 and gain', async () => {
    const res = await createGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.gain.value).toEqual(gain.value.toString())
    expect(body.gain.owner).toEqual(gain.owner.toJSON())
  })

  it('should return status 404 if owner not exists in database', async () => {
    createGainUseCase.execute = jest.fn().mockResolvedValue({
      error: 1,
      message: 'user not found',
      gain: null
    })

    const res = await createGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBe('user not found')
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

  it('should return status 500 if an error occurs', async () => {
    createGainUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    const res = await createGainController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toBe('an error occurs')
  })
})
