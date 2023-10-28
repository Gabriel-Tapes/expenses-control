import { NextResponse, type NextRequest } from 'next/server'
import { type CreateUserUseCase } from './createUserUseCase'
import { CreateUserDTOSchema } from '@/types/DTO'
import { type ZodError } from 'zod'

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(req: NextRequest) {
    try {
      const { name, lastName, email, password } =
        await CreateUserDTOSchema.parseAsync(await req.json())

      const user = await this.createUserUseCase.execute({
        name,
        lastName,
        email,
        password
      })

      return NextResponse.json({ user }, { status: 201 })
    } catch (err) {
      if ((err as Error).name === 'ZodError')
        return NextResponse.json(
          {
            errors: (err as ZodError).issues
          },
          { status: 400 }
        )
      else
        return NextResponse.json(
          {
            error: (err as Error).message
          },
          { status: 500 }
        )
    }
  }
}
