import { Request, Response } from 'express'
import { type CreateUserUseCase } from './createUserUseCase'
import { CreateUserDTOSchema } from '@/types/DTO'
import { type ZodError } from 'zod'

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { name, lastName, email, password } =
        await CreateUserDTOSchema.parseAsync(req.body)

      const user = await this.createUserUseCase.execute({
        name,
        lastName,
        email,
        password
      })

      return res.status(201).json({ user })
    } catch (err) {
      if ((err as Error).name === 'ZodError')
        return res.status(400).json({
          errors: (err as ZodError).issues
        })
      else
        return res.status(500).json({
          error: (err as Error).message
        })
    }
  }
}
