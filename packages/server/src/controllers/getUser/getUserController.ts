import { Request, Response } from 'express'
import { GetUserUseCase } from './getUserUseCase'
import { GetUserDTOSchema } from '@/types/DTO/get/getUserDTO'
import { ZodError } from 'zod'

export class GetUserController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const id = await GetUserDTOSchema.parseAsync(req.headers['x-user-id'])

      const user = await this.getUserUseCase.execute(id)

      if (!user) return res.status(404).json({ error: 'user not found' })

      return res.status(200).json({ user })
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
