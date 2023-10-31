import { randomUUID } from 'crypto'
import { deleteUserController } from '@/controllers/deleteUser'
import { PostgresUsersRepository } from '@/repositories/implementations'
import { user, req, res } from '@tests/utils'

describe('DeleteUserController tests', () => {
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

  it('should return status 204 if delete user successfully', async () => {
    await deleteUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(204)
  })

  it('should return status 404 if user not found', async () => {
    req.headers['x-user-id'] = randomUUID()
    await deleteUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('should return 400 if an invalid id is provided', async () => {
    req.headers['x-user-id'] = 'invalid uuid'
    await deleteUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
  })
})
