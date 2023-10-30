import { editUserController } from '@/controllers/editUser'
import { PostgresUsersRepository } from '@/repositories/implementations'
import { randomUUID } from 'crypto'
import { user, req, res } from '@tests/utils'

describe('editUserController tests', () => {
  const usersRepository = new PostgresUsersRepository()

  beforeAll(() => {
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(async () => {
    req.headers['x-user-id'] = user.id

    await usersRepository.createUser(user)
  })

  afterEach(async () => {
    await usersRepository.deleteUser(user.id)
  })

  it('should return status 200 and user', async () => {
    req.body = {
      name: 'joe',
      lastName: 'doe',
      password: '12345678'
    }

    await editUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 404 if not user found', async () => {
    req.headers['x-user-id'] = randomUUID()
    req.body = { name: 'joe' }

    await editUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })

  it('should return status 400 if all optional fields had not provided', async () => {
    req.body = {}

    await editUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })
})
