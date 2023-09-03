import { randomUUID } from 'crypto'
import { type NextRequest } from 'next/server'
import { DeleteUserUseCase } from './deleteUserUseCase'
import { DeleteUserController } from './deleteUserController'
import { IUsersRepository } from '@/repositories/IUsersRepository'

describe('DeleteUserController tests', () => {
  const deleteUserUseCase = new DeleteUserUseCase({} as IUsersRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  const userId = randomUUID()

  const req = {
    headers: new Headers()
  } as NextRequest
  beforeEach(() => {
    deleteUserUseCase.execute = jest.fn().mockImplementation(async id => {
      if (id === userId) return 0
      else return 1
    })

    req.headers.set('userId', userId)
  })

  it('should return status 204 if delete user successfully', async () => {
    const res = await deleteUserController.handle(req)

    expect(res.status).toBe(204)
  })

  it('should return status 404 if user not found', async () => {
    req.headers.set('userId', randomUUID())
    const res = await deleteUserController.handle(req)

    expect(res.status).toBe(404)
  })

  it('should return 400 if an invalid id is provided', async () => {
    req.headers.set('userId', 'invalid uuid')
    const res = await deleteUserController.handle(req)

    expect(res.status).toBe(400)
  })

  it('should return 500 if an error occurs', async () => {
    deleteUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    const res = await deleteUserController.handle(req)

    expect(res.status).toBe(500)
  })
})
