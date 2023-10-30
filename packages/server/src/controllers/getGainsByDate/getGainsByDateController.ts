import { Request, Response } from 'express'
import { GetGainsByDateUseCase } from './getGainsByDateUseCase'
import { ZodError } from 'zod'
import { GetGainsByDateDTOSchema } from '@/types/DTO/get/getGainsByDateDTO'

export class GetGainsByDateController {
  constructor(private getGainsByDateUseCase: GetGainsByDateUseCase) {}

  async handle(req: Request, res: Response) {
    const userId = req.headers['x-user-id']

    if (!userId)
      return res.status(403).json({ error: 'user is not authenticated' })
    try {
      const { ownerId, startDate, endDate } =
        await GetGainsByDateDTOSchema.parseAsync({
          ...req.body,
          ownerId: userId
        })

      const gains = await this.getGainsByDateUseCase.execute({
        ownerId,
        startDate,
        endDate
      })

      if (!gains) return res.status(404).json({ error: 'user not found' })

      return res.status(200).json({ gains })
    } catch (err) {
      if (err instanceof ZodError)
        return res.status(400).json({ errors: (err as ZodError).issues })

      return res.status(500).json({ error: (err as Error).message })
    }
  }
}
