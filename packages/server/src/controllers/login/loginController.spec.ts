import { LoginUseCase } from './loginUseCase'
import { LoginController } from './loginController'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { LoginDTO } from '@/types/DTO'
import { user, req, res } from '@tests/utils'

describe('LoginController tests', () => {
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

    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  it('should login', async () => {
    req.body = { email: user.email, password: user.password }

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ token: 'jwt token' })
  })

  it('should return status 404 if a wrong email is provided', async () => {
    req.body = { email: 'wrong@test.dev', password: user.password }

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if a wrong password is provided', async () => {
    req.body = {
      email: user.email,
      password: `${user.password} wrong`
    }

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with email mal-formatted', async () => {
    req.body = {
      email: 'mal-formatted',
      password: user.password
    }

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with email blank', async () => {
    req.body = {
      email: '',
      password: user.password
    }

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with an password length greater than 60', async () => {
    req.body = {
      email: user.email,
      password: 'a'.repeat(61)
    }

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with password length lower then 8', async () => {
    req.body = {
      email: user.email,
      password: 'a'.repeat(7)
    }

    await loginController.handle(req, res)

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

    loginUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('An error occurred'))

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalled()
  })
})
