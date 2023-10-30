import { createGainController } from '@/controllers/createGain'
import {
  PostgresGainsRepository,
  PostgresUsersRepository
} from '@/repositories/implementations'
import { gain, req, res } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('CreateGainController tests', () => {
  const usersRepository = new PostgresUsersRepository()
  const gainsRepository = new PostgresGainsRepository()

  beforeAll(async () => {
    await usersRepository.createUser(gain.owner)

    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    req.headers['x-user-id'] = gain.owner.id
    req.body = { value: gain.value.toNumber() }
  })

  afterEach(async () => {
    gainsRepository.deleteGain(gain.owner.id, gain.id)
  })

  afterAll(async () => {
    usersRepository.deleteUser(gain.owner.id)
  })

  it('should return status 201 and gain', async () => {
    await createGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 404 if owner not exists in database', async () => {
    req.headers['x-user-id'] = randomUUID()

    await createGainController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'owner not found' })
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
})
