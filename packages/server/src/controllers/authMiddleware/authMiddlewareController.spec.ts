import { randomUUID } from 'crypto'
import { SignJWT } from 'jose'
import { AuthMiddlewareController } from './authMiddlewareController'
import { AuthMiddlewareUseCase } from './authMiddlewareUseCase'
import { NextFunction } from 'express'
import { req, res } from '@tests/utils'

describe('AuthMiddlewareController tests', () => {
  const id = randomUUID()
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  const next = jest.fn() as NextFunction

  const authMiddlewareUseCase = new AuthMiddlewareUseCase()
  let authMiddlewareController: AuthMiddlewareController
  let validToken: string

  beforeAll(async () => {
    const token = await new SignJWT({ id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1w')
      .sign(secret)
    validToken = `Bearer ${token}`

    res.set = jest.fn().mockReturnThis()
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
  })

  beforeEach(() => {
    authMiddlewareUseCase.execute = jest
      .fn()
      .mockReturnValue({ error: 0, id, message: 'success' })

    authMiddlewareController = new AuthMiddlewareController(
      authMiddlewareUseCase
    )

    req.headers = {}
  })

  it('should set userId header', async () => {
    req.headers.authorization = validToken

    await authMiddlewareController.handle(req, res, next)

    expect(req.headers['x-user-id']).toBeTruthy()
    expect(req.headers['x-user-id']).toEqual(id)
    expect(next).toHaveBeenCalled()
  })

  it('should return status 400 if an invalid token is provided', async () => {
    req.headers.authorization = 'an invalid token'

    await authMiddlewareController.handle(req, res, next)

    expect(authMiddlewareUseCase.execute).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return status 403 if error with status 1 is returned', async () => {
    req.headers.authorization = validToken
    authMiddlewareUseCase.execute = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ error: 1, id: null, message: 'token expired' })
      )

    await authMiddlewareController.handle(req, res, next)

    expect(res.set).toHaveBeenCalledWith('www-authenticate', 'Bearer')
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      message: 'token expired',
      success: false
    })
  })

  it('should return status 400 if error with status 2 is returned', async () => {
    req.headers.authorization = validToken
    authMiddlewareUseCase.execute = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ error: 2, id: null, message: 'something occured' })
      )

    await authMiddlewareController.handle(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'something occured',
      success: false
    })
  })

  it('should return status 500 if an error occurs', async () => {
    req.headers.authorization = validToken
    authMiddlewareUseCase.execute = jest
      .fn()
      .mockRejectedValue(new Error('An error has been occured'))

    await authMiddlewareController.handle(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error has been occured'
    })
  })
})
