import { CreateUserUseCase } from './createUserUseCase'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { CreateUserController } from './createUserController'
import { user, req, res } from '@tests/utils'

describe('CreateUserController tests', () => {
  let createUserUseCase: CreateUserUseCase
  let createUserController: CreateUserController

  beforeAll(() => {
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    createUserUseCase = new CreateUserUseCase(
      jest.fn() as unknown as IUsersRepository
    )

    createUserUseCase.execute = jest.fn().mockResolvedValue(user)

    createUserController = new CreateUserController(createUserUseCase)
  })

  it('should create an user with all data', async () => {
    req.body = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    }

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ user })
  })

  it('should return errors and status 400 without some data', async () => {
    req.body = {
      name: user.name,
      lastName: user.lastName
    }

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with name length greater than 30', async () => {
    req.body = {
      name: 'a'.repeat(31),
      lastName: user.lastName,
      email: user.email,
      password: user.password
    }

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with name blank', async () => {
    req.body = jest.fn().mockResolvedValue({
      name: '',
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with lastName length greater than 100', async () => {
    req.body = {
      name: user.name,
      lastName: 'a'.repeat(101),
      email: user.email,
      password: user.password
    }

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with lastName blank', async () => {
    req.body = {
      name: user.name,
      lastName: '',
      email: user.email,
      password: user.password
    }

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with email mal-formatted', async () => {
    req.body = {
      name: user.name,
      lastName: user.lastName,
      email: 'mal-formatted',
      password: user.password
    }

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with email blank', async () => {
    req.body = {
      name: user.name,
      lastName: user.lastName,
      email: '',
      password: user.password
    }

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with an password length greater than 60', async () => {
    req.body = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: 'a'.repeat(61)
    }

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with password length lower then 8', async () => {
    req.body = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: 'a'.repeat(7)
    }

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return 500 if an error occurs', async () => {
    req.body = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    }

    createUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('An error occurred'))

    await createUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalled()
  })
})
