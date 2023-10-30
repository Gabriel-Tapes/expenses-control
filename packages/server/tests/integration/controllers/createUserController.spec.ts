import { createUserController } from '@/controllers/createUser'
import { getNewClient } from '@/infra/database'
import { Client } from 'pg'
import { user, req, res } from '@tests/utils'

describe('CreateUserController integration tests', () => {
  let client: Client

  beforeAll(async () => {
    client = await getNewClient()

    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  afterEach(async () => {
    await client.query('DELETE FROM users')
  })

  afterAll(async () => {
    await client.end()
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
    expect(res.json).toHaveBeenCalled()
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
    req.body = {
      name: '',
      lastName: user.lastName,
      email: user.email,
      password: user.password
    }

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
})
