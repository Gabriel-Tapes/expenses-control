import { Request, Response } from 'express'
import { EditUserUseCase } from './editUserUseCase'
import { EditUserDTOSchema } from '@/types/DTO'
import { ZodError } from 'zod'

export class EditUserController {
  constructor(private editUserUseCase: EditUserUseCase) {}

  async handle(req: Request, res: Response) {
    const userId = req.headers['x-user-id']

    try {
      const { id, name, lastName, password } =
        await EditUserDTOSchema.parseAsync({
          id: userId,
          ...req.body
        })

      const editedUser = await this.editUserUseCase.execute({
        id,
        name,
        lastName,
        password
      })

      if (!editedUser)
        return res.status(404).json({
          error: 'user not found'
        })

      return res.status(200).json({ user: editedUser })
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
