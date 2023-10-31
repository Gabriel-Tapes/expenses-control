import { Response, Request } from 'express'
import { DeleteUserUseCase } from './deleteUserUseCase'
import { DeleteUserDTOSchema } from '@/types/DTO/delete/deleteUserDTO'
import { ZodError } from 'zod'

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const userId = await DeleteUserDTOSchema.parseAsync(
        req.headers['x-user-id']
      )

      const error = await this.deleteUserUseCase.execute(userId)

      if (error) return res.status(404).json({ error: 'user not found' })

      return res.status(204)
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
