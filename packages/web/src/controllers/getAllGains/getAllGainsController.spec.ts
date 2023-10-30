import { IGainsRepository } from '@/repositories/IGainsRepository'
import { GetAllGainsUseCase } from './getAllGainsUseCase'
import { GetAllGainsController } from './getAllGainsController'
import { gain, req } from '@tests/utils'

describe('GetAllGainsController tests', () => {
  const getAllGainsUseCase = new GetAllGainsUseCase({} as IGainsRepository)
  const getAllGainsController = new GetAllGainsController(getAllGainsUseCase)

  beforeEach(() => {
    req.headers.set('userId', gain.owner.id)
    getAllGainsUseCase.execute = jest.fn().mockResolvedValue([gain.toJSON()])
  })

  it('should return status 200 and gains', async () => {
    const res = await getAllGainsController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.gains).toEqual([gain.toJSON()])
  })

  it('should return status 404 if owner not found', async () => {
    getAllGainsUseCase.execute = jest.fn().mockResolvedValue(null)

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

  it('should return status 500 if an error occurs', async () => {
    getAllGainsUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    const res = await getAllGainsController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toBe('an error occurs')
  })
})
