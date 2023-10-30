import { Request, Response } from 'express'
import { CreateGainUseCase } from './createGainUseCase'
import { ZodError } from 'zod'
import { CreateGainDTOSchema } from '@/types/DTO'

export class CreateGainController {
  constructor(private createGainUseCase: CreateGainUseCase) {}

  async handle(req: Request, res: Response) {
    const userId = req.headers['x-user-id']

    if (!userId)
      return res.status(403).json({ error: 'user is not authenticated' })

    try {
      const { value, ownerId } = await CreateGainDTOSchema.parseAsync({
        ...req.body,
        ownerId: userId
      })

      const { error, message, gain } = await this.createGainUseCase.execute({
        value,
        ownerId
      })

      if (error === 1)
        return res.status(404).json({
          error: message
        })

      return res.status(201).json({
        gain
      })
    } catch (err) {
      if (err instanceof ZodError)
        return res.status(400).json({
          errors: (err as ZodError).issues
        })

      return res.status(500).json({
        error: (err as Error).message
      })
    }
  }
}
