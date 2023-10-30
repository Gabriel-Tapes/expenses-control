import { getGainsByDateController } from '@/controllers/getGainsByDate'
import {
  PostgresGainsRepository,
  PostgresUsersRepository
} from '@/repositories/implementations'
import { gain, req, res } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('getGainsByDateController integration tests', () => {
  const usersRepository = new PostgresUsersRepository()
  const gainsRepository = new PostgresGainsRepository()

  beforeAll(async () => {
    await usersRepository.createUser(gain.owner)
    await gainsRepository.createGain(gain)

    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    req.headers['x-user-id'] = gain.owner.id

    req.body = {
      startDate: new Date(gain.createdAt.getTime() - 10),
      endDate: new Date(gain.createdAt.getTime() + 10)
    }
  })

  afterAll(async () => {
    await usersRepository.deleteUser(gain.owner.id)
  })

  it('should return status 200 and gains', async () => {
    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ gains: [gain] })
  })

  it('should return status 200 and gains if startDate is later than endDate', async () => {
    req.body = {
      startDate: new Date(gain.createdAt.getTime() + 10),
      endDate: new Date(gain.createdAt.getTime() - 10)
    }

    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ gains: [gain] })
  })

  it('should return status 403 if not userId is provided', async () => {
    req.headers['x-user-id'] = undefined

    await getGainsByDateController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'user is not authenticated' })
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
})
