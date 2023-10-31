import { Response, Request } from 'express'
import { GetGainUseCase } from './getGainUseCase'
import { ZodError } from 'zod'
import { GetGainDTOSchema } from '@/types/DTO'

export class GetGainController {
  constructor(private getGainUseCase: GetGainUseCase) {}

  async handle(req: Request, res: Response) {
    const userId = req.headers['x-user-id']

    if (!userId)
      return res.status(403).json({ error: 'user is not authenticated' })

    try {
      const { id, ownerId } = await GetGainDTOSchema.parseAsync({
        ...req.body,
        ownerId: userId
      })

      const gain = await this.getGainUseCase.execute({ ownerId, id })

      if (!gain) return res.status(404).json({ error: 'gain not found' })

      return res.status(200).json({ gain })
    } catch (err) {
      if (err instanceof ZodError)
        return res.status(400).json({ errors: (err as ZodError).issues })

      return res.status(500).json({ error: (err as Error).message })
    }
  }
}
