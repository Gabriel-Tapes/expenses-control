import { Response, Request } from 'express'
import { type LoginUseCase } from './loginUseCase'
import { LoginDTOSchema } from '@/types/DTO'
import { type ZodError } from 'zod'

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { email, password } = await LoginDTOSchema.parseAsync(req.body)

      const { error, token } = await this.loginUseCase.execute({
        email,
        password
      })

      if (!error)
        return res.status(200).json({
          token
        })

      if (error === 1)
        return res.status(404).json({
          error: 'invalid email: user not found'
        })

      return res.status(400).json({
        error: 'invalid password'
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
