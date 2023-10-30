import { randomUUID } from 'crypto'
import { SignJWT } from 'jose'
import { AuthMiddlewareController } from './authMiddlewareController'
import { AuthMiddlewareUseCase } from './authMiddlewareUseCase'
import { NextRequest } from 'next/server'

describe('AuthMiddlewareController tests', () => {
  const id = randomUUID()
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const req = {
    headers: new Headers()
  } as NextRequest

  const authMiddlewareUseCase = new AuthMiddlewareUseCase()
  let authMiddlewareController: AuthMiddlewareController
  let validToken: string

  beforeAll(async () => {
    const token = await new SignJWT({ id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1w')
      .sign(secret)
    validToken = `Bearer ${token}`
  })

  beforeEach(() => {
    authMiddlewareUseCase.execute = jest
      .fn()
      .mockReturnValue({ error: 0, id, message: 'success' })

    authMiddlewareController = new AuthMiddlewareController(
      authMiddlewareUseCase
    )
  })

  it('should set userId header', async () => {
    req.headers.set('authorization', validToken)

    const res = await authMiddlewareController.handle(req)
    const userId = res.headers.get('x-middleware-request-x-user-id')

    expect(userId).toBeTruthy()
    expect(userId).toEqual(id)
  })

  it('should return status 400 if an invalid token is provided', async () => {
    req.headers.set('authorization', 'an invalid token')
    jest.spyOn(authMiddlewareUseCase, 'execute')

    const res = await authMiddlewareController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.errors).toBeTruthy()
    expect(authMiddlewareUseCase.execute).not.toHaveBeenCalled()
  })

  it('should return status 403 if error with status 1 is returned', async () => {
    req.headers.set('authorization', validToken)
    authMiddlewareUseCase.execute = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ error: 1, id: null, message: 'token expired' })
      )

    const res = await authMiddlewareController.handle(req)
    const body = await res.json()
    const headers = res.headers

    expect(res.status).toBe(403)
    expect(body.message).toBe('token expired')
    expect(headers.get('www-authenticate')).toBe('Bearer')
  })

  it('should return status 400 if error with status 2 is returned', async () => {
    req.headers.set('authorization', validToken)
    authMiddlewareUseCase.execute = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ error: 2, id: null, message: 'something occured' })
      )

    const res = await authMiddlewareController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.message).toBe('something occured')
  })

  it('should return status 500 if an error occurs', async () => {
    req.headers.set('authorization', validToken)
    authMiddlewareUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('An error has been occured'))

    const res = await authMiddlewareController.handle(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.error).toBeTruthy()
    expect(body.error).toBe('An error has been occured')
  })
})
