import { loginController } from '@/controllers/login'
import { PostgresUsersRepository } from '@/repositories/implementations'
import { hash } from 'bcrypt'
import { user, req, res } from '@tests/utils'

describe('LoginController integration tests', () => {
  const password = user.password

  const usersRepository = new PostgresUsersRepository()

  beforeAll(async () => {
    user.password = await hash(user.password, 10)
    await usersRepository.createUser(user)

    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  afterAll(async () => {
    await usersRepository.deleteUser(user.id)
  })

  it('should login', async () => {
    req.body = { email: user.email, password }

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 404 if a wrong email is provided', async () => {
    req.body = { email: 'wrong@test.dev', password }

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 400 if a wrong password is provided', async () => {
    req.body = {
      email: user.email,
      password: `${password} wrong`
    }

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with email mal-formatted', async () => {
    req.body = {
      email: 'mal-formatted',
      password
    }

    await loginController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return errors and status 400 with email blank', async () => {
    req.body = {
      email: '',
      password
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
})
