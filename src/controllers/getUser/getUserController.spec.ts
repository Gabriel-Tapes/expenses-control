import { NextRequest } from 'next/server'
import { GetUserUseCase } from './getUserUseCase'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { GetUserController } from './getUserController'
import { User } from '@/models/user'

describe('GetUserController tests', () => {
  const req = { headers: new Headers() } as NextRequest

  const getUserUseCase = new GetUserUseCase({} as IUsersRepository)
  const getUserController = new GetUserController(getUserUseCase)

  const user = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  })

  beforeEach(() => {
    req.headers.set('userId', user.id)
    getUserUseCase.execute = jest.fn().mockResolvedValue(user)
  })

  it('should return status 200 and user', async () => {
    const res = await getUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.user.email).toEqual(user.email)
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
