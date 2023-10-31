import { Request, Response, NextFunction } from 'express'
import { AuthMiddlewareUseCase } from './authMiddlewareUseCase'
import { AuthMiddlewareDTOSchema } from '@/types/DTO'
import { ZodError } from 'zod'

export class AuthMiddlewareController {
  constructor(private authMiddlewareUseCase: AuthMiddlewareUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const token = AuthMiddlewareDTOSchema.parse(req.headers?.authorization)

      const { error, id, message } =
        await this.authMiddlewareUseCase.execute(token)

      if (!error) {
        req.headers['x-user-id'] = id

        return next()
      }

      if (error === 1) {
        res.set('www-authenticate', 'Bearer')

        return res.status(403).json({
          success: false,
          message
        })
      }

      return res.status(400).json({
        success: false,
        message
      })
    } catch (err) {
      if ((err as Error).name === 'ZodError')
        return res.status(400).json({
          errors: (err as ZodError).issues
        })

      return res.status(500).json({
        error: (err as Error).message
      })
    }
  }
}
