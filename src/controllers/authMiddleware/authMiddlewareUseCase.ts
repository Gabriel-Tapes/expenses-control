import { AuthMiddlewareDTO } from '@/types/DTO'
import { jwtVerify, errors } from 'jose'

export class AuthMiddlewareUseCase {
  async execute(token: AuthMiddlewareDTO) {
    try {
      const { id } = (
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      ).payload as { id: string }

      return {
        error: null,
        id,
        message: 'success'
      }
    } catch (err) {
      if (err instanceof errors.JWTExpired)
        return {
          error: 1,
          message: (err as Error).message
        }

      return {
        error: 2,
        message: `${(err as Error).name}: ${(err as Error).message}`
      }
    }
  }
}
