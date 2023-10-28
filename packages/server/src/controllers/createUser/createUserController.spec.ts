import { CreateUserUseCase } from './createUserUseCase'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { CreateUserController } from './createUserController'
import { user, req } from '@tests/utils'

describe('CreateUserController tests', () => {
  let createUserUseCase: CreateUserUseCase
  let createUserController: CreateUserController

  beforeEach(() => {
    createUserUseCase = new CreateUserUseCase(
      jest.fn() as unknown as IUsersRepository
    )

    createUserUseCase.execute = jest.fn().mockResolvedValue(user)

    createUserController = new CreateUserController(createUserUseCase)
  })

  it('should create an user with all data', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })

    const res = await createUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.user).toBeTruthy()
    expect(body).toEqual({ user: user.toJSON() })
  })

  it('should return errors and status 400 without some data', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: user.name,
      lastName: user.lastName
    })

    const res = await createUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with name length greater than 30', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: 'a'.repeat(31),
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })

    const res = await createUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with name blank', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: '',
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })

    const res = await createUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with lastName length greater than 100', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: user.name,
      lastName: 'a'.repeat(101),
      email: user.email,
      password: user.password
    })

    const res = await createUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with lastName blank', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: user.name,
      lastName: '',
      email: user.email,
      password: user.password
    })

    const res = await createUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with email mal-formatted', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: user.name,
      lastName: user.lastName,
      email: 'mal-formatted',
      password: user.password
    })

    const res = await createUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with email blank', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: user.name,
      lastName: user.lastName,
      email: '',
      password: user.password
    })

    const res = await createUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with an password length greater than 60', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: 'a'.repeat(61)
    })

    const res = await createUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return errors and status 400 with password length lower then 8', async () => {
    req.json = jest.fn().mockResolvedValue({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: 'a'.repeat(7)
    })

    const res = await createUserController.handle(req)

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

    createUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('An error occurred'))

    const res = await createUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toBeTruthy()
  })
})
