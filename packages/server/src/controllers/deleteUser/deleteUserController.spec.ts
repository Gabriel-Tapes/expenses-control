import { randomUUID } from 'crypto'
import { DeleteUserUseCase } from './deleteUserUseCase'
import { DeleteUserController } from './deleteUserController'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { req, res } from '@tests/utils'

describe('DeleteUserController tests', () => {
  const deleteUserUseCase = new DeleteUserUseCase({} as IUsersRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  const userId = randomUUID()

  beforeAll(() => {
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    deleteUserUseCase.execute = jest.fn().mockImplementation(async id => {
      if (id === userId) return 0
      else return 1
    })

    req.headers['x-user-id'] = userId
  })

  it('should return status 204 if delete user successfully', async () => {
    await deleteUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(204)
  })

  it('should return status 404 if user not found', async () => {
    req.headers['x-user-id'] = randomUUID()
    await deleteUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('should return 400 if an invalid id is provided', async () => {
    req.headers['x-user-id'] = 'invalid uuid'
    await deleteUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return 500 if an error occurs', async () => {
    deleteUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    await deleteUserController.handle(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})
