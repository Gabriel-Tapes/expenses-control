import { randomUUID } from 'crypto'
import { deleteUserController } from '@/controllers/deleteUser'
import { PostgresUsersRepository } from '@/repositories/implementations'
import { user, req } from '@tests/utils'

describe('DeleteUserController tests', () => {
  const usersRepository = new PostgresUsersRepository()

  beforeEach(async () => {
    req.headers.set('userId', user.id)

    await usersRepository.createUser(user)
  })

  afterEach(async () => {
    await usersRepository.deleteUser(user.id)
  })

  it('should return status 204 if delete user successfully', async () => {
    const res = await deleteUserController.handle(req)

    expect(res.status).toBe(204)
  })

  it('should return status 404 if user not found', async () => {
    req.headers.set('userId', randomUUID())
    const res = await deleteUserController.handle(req)

    expect(res.status).toBe(404)
  })

  it('should return 400 if an invalid id is provided', async () => {
    req.headers.set('userId', 'invalid uuid')
    const res = await deleteUserController.handle(req)

    expect(res.status).toBe(400)
  })
})
