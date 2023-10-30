import { randomUUID } from 'crypto'
import { SignJWT } from 'jose'
import { authMiddlewareController } from '@/controllers/authMiddleware'
import { req, res } from '@tests/utils'

describe('AuthMiddlewareController tests', () => {
  const id = randomUUID()
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  let validToken: string

  const next = jest.fn().mockReturnThis()

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
    req.headers = {}
  })

  afterEach(() => {
    jest.useRealTimers()
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

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return status 403 if error with status 1 is returned', async () => {
    req.headers.authorization = validToken
    jest.useFakeTimers()

    const eightDays = 1000 * 60 * 60 * 24 * 8

    jest.setSystemTime(Date.now() + eightDays)

    await authMiddlewareController.handle(req, res, next)

    expect(res.set).toHaveBeenCalledWith('www-authenticate', 'Bearer')
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      message: 'token expired',
      success: false
    })
  })

  it('should return status 400 if error with status 2 is returned', async () => {
    const otherJwt = await new SignJWT({
      message: 'this will throw into AuthMiddlewareUseCase.execute'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1w')
      .sign(new TextEncoder().encode('any other secret'))
    req.headers.authorization = `Bearer ${otherJwt}`

    await authMiddlewareController.handle(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalled()
  })
})
