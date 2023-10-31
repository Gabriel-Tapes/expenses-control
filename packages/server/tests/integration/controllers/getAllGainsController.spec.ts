import { getAllGainsController } from '@/controllers/getAllGains'
import {
  PostgresGainsRepository,
  PostgresUsersRepository
} from '@/repositories/implementations'
import { gain, req, res } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('GetAllGainsController tests', () => {
  const usersRepository = new PostgresUsersRepository()
  const gainsRepository = new PostgresGainsRepository()

  beforeAll(async () => {
    await usersRepository.createUser(gain.owner)
    await gainsRepository.createGain(gain)

    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  afterAll(async () => {
    await usersRepository.deleteUser(gain.owner.id)
  })

  beforeEach(() => {
    req.headers['x-user-id'] = gain.owner.id
  })

  it('should return status 200 and gains', async () => {
    await getAllGainsController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ gains: [gain] })
  })

  it('should return status 404 if owner not found', async () => {
    req.headers['x-user-id'] = randomUUID()

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
})
