import { GetUserUseCase } from './getUserUseCase'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { GetUserController } from './getUserController'
import { user, req } from '@tests/utils'

describe('GetUserController tests', () => {
  const getUserUseCase = new GetUserUseCase({} as IUsersRepository)
  const getUserController = new GetUserController(getUserUseCase)

  beforeEach(() => {
    req.headers.set('userId', user.id)
    getUserUseCase.execute = jest.fn().mockResolvedValue(user)
  })

  it('should return status 200 and user', async () => {
    const res = await getUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ user: user.toJSON() })
  })

  it('should return status 404 if not found user', async () => {
    getUserUseCase.execute = jest.fn().mockResolvedValue(null)

    const res = await getUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBe('user not found')
  })

  it('should return status 400 if an invalid id is provided', async () => {
    req.headers.set('userId', 'invalid id')

    const res = await getUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 500 if an error occurs', async () => {
    getUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    const res = await getUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toBe('an error occurs')
  })
})
