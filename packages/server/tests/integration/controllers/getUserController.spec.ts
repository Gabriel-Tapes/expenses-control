import { randomUUID } from 'crypto'
import { PostgresUsersRepository } from '@/repositories/implementations'
import { getUserController } from '@/controllers/getUser'
import { user, req, res } from '@tests/utils'

describe('GetUserController tests', () => {
  const usersRepository = new PostgresUsersRepository()

  beforeAll(async () => {
    await usersRepository.createUser(user)

    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    req.headers['x-user-id'] = user.id
  })

  afterAll(async () => {
    await usersRepository.deleteUser(user.id)
  })

  it('should return status 200 and user', async () => {
    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ user })
  })

  it('should return status 404 if not found user', async () => {
    req.headers['x-user-id'] = randomUUID()

    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })

  it('should return status 400 if an invalid id is provided', async () => {
    req.headers['x-user-id'] = 'invalid id'

    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })
})
