import { NextResponse, type NextRequest } from 'next/server'
import { CreateGainUseCase } from './createGainUseCase'
import { ZodError } from 'zod'
import { CreateGainDTOSchema } from '@/types/DTO'

export class CreateGainController {
  constructor(private createGainUseCase: CreateGainUseCase) {}

  async handle(req: NextRequest) {
    const userId = req.headers.get('userId')

    if (!userId)
      return NextResponse.json(
        { error: 'user is not authenticated' },
        { status: 403 }
      )

    try {
      const { value, ownerId } = await CreateGainDTOSchema.parseAsync({
        ...(await req.json()),
        ownerId: userId
      })

      const { error, message, gain } = await this.createGainUseCase.execute({
        value,
        ownerId
      })

      if (error === 1)
        return NextResponse.json(
          {
            error: message
          },
          { status: 404 }
        )

      return NextResponse.json(
        {
          gain
        },
        { status: 201 }
      )
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
