import { NextRequest } from 'next/server'
import { EditUserUseCase } from './editUserUseCase'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { EditUserController } from './editUserController'
import { User } from '@/models/user'
import { randomUUID } from 'crypto'

describe('editUserController tests', () => {
  const user = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  })
  const req = {
    headers: new Headers()
  } as NextRequest

  const editUserUseCase = new EditUserUseCase({} as IUsersRepository)
  const editUserController = new EditUserController(editUserUseCase)

  beforeEach(() => {
    editUserUseCase.execute = jest.fn().mockResolvedValue(user)
    req.headers.set('userId', user.id)
  })

  it('should return status 200 and user', async () => {
    req.json = jest.fn().mockReturnValue({
      name: 'joe',
      lastName: 'doe',
      password: '12345678'
    })

    const res = await editUserController.handle(req)

    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.user.id).toEqual(user.id)
  })

  it('should return status 404 if not user found', async () => {
    editUserUseCase.execute = jest.fn().mockResolvedValue(null)
    req.json = jest.fn().mockResolvedValue({ name: 'joe' })

    const res = await editUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBeTruthy()
    expect(body.error).toBe('user not found')
  })

  it('should return status 400 if all optional fields had not provided', async () => {
    req.json = jest.fn().mockResolvedValue({})

    const res = await editUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
  })

  it('should return status 500 if any error occurs', async () => {
    req.json = jest.fn().mockResolvedValue({ lastName: 'doe' })
    editUserUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('an error occurs'))

    const res = await editUserController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toBeTruthy()
    expect(body.error).toBe('an error occurs')
  })
})
