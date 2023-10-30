import { GetUserUseCase } from './getUserUseCase'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { GetUserController } from './getUserController'
import { user, req, res } from '@tests/utils'

describe('GetUserController tests', () => {
  const getUserUseCase = new GetUserUseCase({} as IUsersRepository)
  const getUserController = new GetUserController(getUserUseCase)

  beforeAll(() => {
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    req.headers['x-user-id'] = user.id
    getUserUseCase.execute = jest.fn().mockResolvedValue(user)
  })

  it('should return status 200 and user', async () => {
    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ user })
  })

  it('should return status 404 if not found user', async () => {
    getUserUseCase.execute = jest.fn().mockResolvedValue(null)

    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
  })

  it('should return status 400 if an invalid id is provided', async () => {
    req.headers['x-user-id'] = 'invalid id'

    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })

  it('should return status 500 if an error occurs', async () => {
    getUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    await getUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'an error occurs' })
  })
})
