import { randomUUID } from 'crypto'
import { SignJWT } from 'jose'
import { NextRequest } from 'next/server'
import { authMiddlewareController } from '@/controllers/authMiddleware'

describe('AuthMiddlewareController tests', () => {
  const id = randomUUID()
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const req = {
    headers: new Headers()
  } as NextRequest

  let validToken: string

  beforeAll(async () => {
    const token = await new SignJWT({ id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1w')
      .sign(secret)
    validToken = `Bearer ${token}`
  })

  afterEach(() => {
    jest.useRealTimers()
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

    const res = await authMiddlewareController.handle(req)
    expect(res.status).toBe(400)

    const body = await res.json()
    expect(body.errors).toBeTruthy()
  })

  it('should return status 403 if error with status 1 is returned', async () => {
    req.headers.set('authorization', validToken)
    jest.useFakeTimers()

    const eightDays = 1000 * 60 * 60 * 24 * 8

    jest.setSystemTime(Date.now() + eightDays)

    const res = await authMiddlewareController.handle(req)
    expect(res.status).toBe(403)

    const body = await res.json()
    const headers = res.headers
    expect(body.message).toBe('token expired')
    expect(headers.get('www-authenticate')).toBe('Bearer')
  })

  it('should return status 400 if error with status 2 is returned', async () => {
    const otherJwt = await new SignJWT({
      message: 'this will throw into AuthMiddlewareUseCase.execute'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1w')
      .sign(new TextEncoder().encode('any other secret'))
    req.headers.set('authorization', `Bearer ${otherJwt}`)

    const res = await authMiddlewareController.handle(req)
    expect(res.status).toBe(400)

    const body = await res.json()
    expect(body.message).toBeTruthy()
  })
})
