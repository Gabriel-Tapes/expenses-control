import { User } from '@/models/user'
import { NextRequest } from 'next/server'
import { loginController } from '@/controllers/login'
import { PostgresUsersRepository } from '@/repositories/implementations'
import { hash } from 'bcrypt'

describe('LoginController integration tests', () => {
  const user = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  })

  const password = user.password

  const usersRepository = new PostgresUsersRepository()

  const req = {} as NextRequest

  beforeAll(async () => {
    user.password = await hash(user.password, 10)
    await usersRepository.createUser(user)
  })

  afterAll(async () => {
    await usersRepository.deleteUser(user.id)
  })

  it('should login', async () => {
    req.json = jest.fn().mockResolvedValue({ email: user.email, password })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.token).toBeTruthy()
  })

  it('should return status 404 if a wrong email is provided', async () => {
    req.json = jest
      .fn()
      .mockResolvedValue({ email: 'wrong@test.dev', password })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBeTruthy()
  })

  it('should return status 400 if a wrong password is provided', async () => {
    req.json = jest.fn().mockResolvedValue({
      email: user.email,
      password: `${password} wrong`
    })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toBeTruthy()
  })

  it('should return errors and status 400 with email mal-formatted', async () => {
    req.json = jest.fn().mockResolvedValue({
      email: 'mal-formatted',
      password
    })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with email blank', async () => {
    req.json = jest.fn().mockResolvedValue({
      email: '',
      password
    })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with an password length greater than 60', async () => {
    req.json = jest.fn().mockResolvedValue({
      email: user.email,
      password: 'a'.repeat(61)
    })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with password length lower then 8', async () => {
    req.json = jest.fn().mockResolvedValue({
      email: user.email,
      password: 'a'.repeat(7)
    })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })
})
