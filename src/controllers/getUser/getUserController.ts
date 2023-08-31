import { NextRequest, NextResponse } from 'next/server'
import { GetUserUseCase } from './getUserUseCase'
import { GetUserDTOSchema } from '@/types/DTO/get/getUserDTO'
import { ZodError } from 'zod'

export class GetUserController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async handle(req: NextRequest) {
    try {
      const id = await GetUserDTOSchema.parseAsync(req.headers.get('userId'))

      const user = await this.getUserUseCase.execute(id)

      if (!user)
        return NextResponse.json({ error: 'user not found' }, { status: 404 })

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
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
