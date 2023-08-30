import { NextRequest, NextResponse } from 'next/server'
import { EditUserUseCase } from './editUserUseCase'
import { EditUserDTOSchema } from '@/types/DTO'
import { ZodError } from 'zod'

export class EditUserController {
  constructor(private editUserUseCase: EditUserUseCase) {}

  async handle(req: NextRequest) {
    const userId = req.headers.get('userId')

    try {
      const { id, name, lastName, password } =
        await EditUserDTOSchema.parseAsync({
          id: userId,
          ...(await req.json())
        })

      const editedUser = await this.editUserUseCase.execute({
        id,
        name,
        lastName,
        password
      })

      if (!editedUser)
        return NextResponse.json(
          {
            error: 'user not found'
          },
          { status: 404 }
        )

      return NextResponse.json({
        user: {
          id,
          name: editedUser.name,
          lastName: editedUser.lastName,
          email: editedUser.email,
          createdAt: editedUser.createdAt,
          updatedAt: editedUser.updatedAt
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
