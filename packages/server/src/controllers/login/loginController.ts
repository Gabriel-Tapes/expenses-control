import { NextResponse, type NextRequest } from 'next/server'
import { type LoginUseCase } from './loginUseCase'
import { LoginDTOSchema } from '@/types/DTO'
import { type ZodError } from 'zod'

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(req: NextRequest) {
    try {
      const { email, password } = await LoginDTOSchema.parseAsync(
        await req.json()
      )

      const { error, token } = await this.loginUseCase.execute({
        email,
        password
      })

      if (!error)
        return NextResponse.json(
          {
            token
          },
          { status: 200 }
        )

      if (error === 1)
        return NextResponse.json(
          {
            error: 'invalid email: user not found'
          },
          { status: 404 }
        )

      return NextResponse.json(
        {
          error: 'invalid password'
        },
        { status: 400 }
      )
    } catch (err) {
      if ((err as Error).name === 'ZodError')
        return NextResponse.json(
          {
            errors: (err as ZodError).issues
          },
          { status: 400 }
        )

      return NextResponse.json(
        {
          error: (err as Error).message
        },
        { status: 500 }
      )
    }
  }
}
