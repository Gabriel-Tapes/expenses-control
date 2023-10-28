import { editUserController } from '@/controllers/editUser'
import { PostgresUsersRepository } from '@/repositories/implementations'
import { randomUUID } from 'crypto'
import { user, req } from '@tests/utils'

describe('editUserController tests', () => {
  const usersRepository = new PostgresUsersRepository()

  beforeEach(async () => {
    req.headers.set('userId', user.id)

    await usersRepository.createUser(user)
  })

  afterEach(async () => {
    await usersRepository.deleteUser(user.id)
  })

  it('should return status 200 and user', async () => {
    req.json = jest.fn().mockReturnValue({
      name: 'joe',
      lastName: 'doe',
      password: '12345678'
    })

    const res = await editUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.user.id).toEqual(user.id)
  })

  it('should return status 404 if not user found', async () => {
    req.headers.set('userId', randomUUID())
    req.json = jest.fn().mockResolvedValue({ name: 'joe' })

    const res = await editUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBeTruthy()
    expect(body.error).toBe('user not found')
  })

  it('should return status 400 if all optional fields had not provided', async () => {
    req.json = jest.fn().mockResolvedValue({})

    const res = await editUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })
})
