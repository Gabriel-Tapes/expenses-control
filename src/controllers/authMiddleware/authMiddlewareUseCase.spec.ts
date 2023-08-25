import { SignJWT } from 'jose'
import { randomUUID } from 'node:crypto'
import { AuthMiddlewareUseCase } from './authMiddlewareUseCase'

describe('AuthMiddlewareUseCase tests', () => {
  const id = randomUUID()
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  let token: string

  const authMiddlewareUseCase = new AuthMiddlewareUseCase()

  beforeAll(async () => {
    process.env.JWT_SECRET = 'secret'
    token = await new SignJWT({ id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1w')
      .sign(secret)
  })

  it('should verify token', async () => {
    const {
      error,
      id: userId,
      message
    } = await authMiddlewareUseCase.execute(token)

    expect(error).toBeNull()
    expect(userId).toBeTruthy()
    expect(userId).toEqual(id)
    expect(message).toBe('success')
  })

  it('should return error 1 if an expired token is provided', async () => {
    const expiredToken = await new SignJWT({ id })
      .setProtectedHeader({
        alg: 'HS256'
      })
      .setExpirationTime('0s')
      .sign(secret)

    const { error, id: userId } = await authMiddlewareUseCase.execute(
      expiredToken
    )

    expect(error).toBe(1)
    expect(userId).not.toBeTruthy()
  })

  it('should return error 2 if any other problem occurs', async () => {
    const { error, id } = await authMiddlewareUseCase.execute(
      'forcing JsonWebTokenError'
    )

    expect(error).toBe(2)
    expect(id).not.toBeTruthy()
  })
})
