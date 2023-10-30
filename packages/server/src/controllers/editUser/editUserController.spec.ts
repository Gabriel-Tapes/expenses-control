import { EditUserUseCase } from './editUserUseCase'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { EditUserController } from './editUserController'
import { user, req, res } from '@tests/utils'

describe('editUserController tests', () => {
  const editUserUseCase = new EditUserUseCase({} as IUsersRepository)
  const editUserController = new EditUserController(editUserUseCase)

  beforeAll(() => {
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    editUserUseCase.execute = jest.fn().mockResolvedValue(user)
    req.headers['x-user-id'] = user.id
  })

  it('should return status 200 and user', async () => {
    req.body = {
      name: 'joe',
      lastName: 'doe',
      password: '12345678'
    }

    await editUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ user })
  })

  it('should return status 404 if not user found', async () => {
    editUserUseCase.execute = jest.fn().mockResolvedValue(null)
    req.body = { name: 'joe' }

    await editUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })

  it('should return status 400 if all optional fields had not provided', async () => {
    req.body = {}

    await editUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 500 if any error occurs', async () => {
    req.body = { lastName: 'doe' }
    editUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    await editUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'an error occurs' })
  })
})
