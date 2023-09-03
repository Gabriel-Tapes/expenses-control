import { randomUUID } from 'crypto'
import { type NextRequest } from 'next/server'
import { User } from '@/models/user'
import { PostgresUsersRepository } from '@/repositories/implementations'
import { getUserController } from '@/controllers/getUser'

describe('GetUserController tests', () => {
  const req = { headers: new Headers() } as NextRequest

  const user = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  })

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
    expect(body.user.email).toEqual(user.email)
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
