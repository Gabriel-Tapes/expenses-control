import { User } from '@/models/user'
import { NextRequest } from 'next/server'
import { LoginUseCase } from './loginUseCase'
import { LoginController } from './loginController'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { LoginDTO } from '@/types/DTO'

describe('LoginController tests', () => {
  const user = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  })

  const req = {} as NextRequest

  let loginUseCase: LoginUseCase
  let loginController: LoginController

  beforeAll(() => {
    loginUseCase = new LoginUseCase(jest.fn() as unknown as IUsersRepository)

    loginUseCase.execute = jest
      .fn()
      .mockImplementation(async ({ email, password }: LoginDTO) => {
        if (email === user.email && password === user.password)
          return { error: 0, token: 'jwt token' }
        else if (email !== user.email) return { error: 1 }

        return { error: 2 }
      })

    loginController = new LoginController(loginUseCase)
  })

  it('should login', async () => {
    req.json = jest
      .fn()
      .mockResolvedValue({ email: user.email, password: user.password })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.token).toBeTruthy()
    expect(body.token).toEqual('jwt token')
  })

  it('should return status 404 if a wrong email is provided', async () => {
    req.json = jest
      .fn()
      .mockResolvedValue({ email: 'wrong@test.dev', password: user.password })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBeTruthy()
  })

  it('should return status 400 if a wrong password is provided', async () => {
    req.json = jest.fn().mockResolvedValue({
      email: user.email,
      password: `${user.password} wrong`
    })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toBeTruthy()
  })

  it('should return errors and status 400 with email mal-formatted', async () => {
    req.json = jest.fn().mockResolvedValue({
      email: 'mal-formatted',
      password: user.password
    })

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with email blank', async () => {
    req.json = jest.fn().mockResolvedValue({
      email: '',
      password: user.password
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

  it('should return 500 if an error occurs', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })

    loginUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('An error occurred'))

    const res = await loginController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toBeTruthy()
  })
})
