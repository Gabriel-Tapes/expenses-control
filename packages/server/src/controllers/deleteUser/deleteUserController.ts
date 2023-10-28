import { NextResponse, type NextRequest } from 'next/server'
import { DeleteUserUseCase } from './deleteUserUseCase'
import { DeleteUserDTOSchema } from '@/types/DTO/delete/deleteUserDTO'
import { ZodError } from 'zod'

export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(req: NextRequest) {
    try {
      const userId = await DeleteUserDTOSchema.parseAsync(
        req.headers.get('x-user-id')
      )

      const error = await this.deleteUserUseCase.execute(userId)

      if (error)
        return NextResponse.json({ error: 'user not found' }, { status: 404 })

      return new NextResponse(null, { status: 204 })
    } catch (err) {
      if (err instanceof ZodError)
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
