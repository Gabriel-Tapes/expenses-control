import { randomUUID } from 'crypto'
import { PostgresUsersRepository } from '@/repositories/implementations'
import { getUserController } from '@/controllers/getUser'
import { user, req } from '@tests/utils'

describe('GetUserController tests', () => {
  const usersRepository = new PostgresUsersRepository()

  beforeAll(async () => {
    await usersRepository.createUser(user)
  })

  beforeEach(() => {
    req.headers.set('userId', user.id)
  })

  afterAll(async () => {
    await usersRepository.deleteUser(user.id)
  })

  it('should return status 200 and user', async () => {
    const res = await getUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ user: user.toJSON() })
  })

  it('should return status 404 if not found user', async () => {
    req.headers.set('userId', randomUUID())

    const res = await getUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBe('user not found')
  })

  it('should return status 400 if an invalid id is provided', async () => {
    req.headers.set('userId', 'invalid id')

    const res = await getUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })
})
