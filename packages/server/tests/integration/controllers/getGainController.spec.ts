import { getGainController } from '@/controllers/getGain'
import {
  PostgresGainsRepository,
  PostgresUsersRepository
} from '@/repositories/implementations'
import { gain, req, res } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('GetGainController integration tests', () => {
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
  })

  afterAll(async () => {
    await usersRepository.deleteUser(gain.owner.id)
  })

  it('should return status 200 and gain', async () => {
    req.body = { id: gain.id }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ gain })
  })

  it('should return status 403 if ownerId is not provided', async () => {
    req.headers['x-user-id'] = undefined
    req.body = { id: gain.id }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 404 if a non-matching ownerId is provided', async () => {
    req.headers['x-user-id'] = randomUUID()
    req.body = { id: gain.id }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 404 if a non-matching gainId is provided', async () => {
    req.body = { id: randomUUID() }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if gainId is not provided', async () => {
    req.body = {}

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if a invalid ownerId is provided', async () => {
    req.headers['x-user-id'] = 'invalid ownerId'
    req.body = { id: gain.id }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if a invalid gainId is provided', async () => {
    req.body = { id: 'invalid gainId' }

    await getGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })
})
