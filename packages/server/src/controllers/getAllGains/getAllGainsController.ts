import { Response, Request } from 'express'
import { type GetAllGainsUseCase } from './getAllGainsUseCase'
import { ZodError } from 'zod'
import { GetAllGainsDTOSchema } from '@/types/DTO/get/getAllGainsDTO'

export class GetAllGainsController {
  constructor(private getAllGainsUseCase: GetAllGainsUseCase) {}

  async handle(req: Request, res: Response) {
    const userId = req.headers['x-user-id']

    if (!userId)
      return res.status(403).json({ error: 'user not authenticated' })

    try {
      const ownerId = await GetAllGainsDTOSchema.parseAsync(userId)

      const gains = await this.getAllGainsUseCase.execute(ownerId)

      if (!gains) return res.status(404).json({ error: 'owner not found' })

      return res.status(200).json({ gains })
    } catch (err) {
      if (err instanceof ZodError)
        return res.status(400).json({ errors: (err as ZodError).issues })

      return res.status(500).json({ error: (err as Error).message })
    }
  }
}
