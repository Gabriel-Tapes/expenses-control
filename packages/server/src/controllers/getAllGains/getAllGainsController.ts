import { NextResponse, type NextRequest } from 'next/server'
import { type GetAllGainsUseCase } from './getAllGainsUseCase'
import { ZodError } from 'zod'
import { GetAllGainsDTOSchema } from '@/types/DTO/get/getAllGainsDTO'

export class GetAllGainsController {
  constructor(private getAllGainsUseCase: GetAllGainsUseCase) {}

  async handle(req: NextRequest) {
    const userId = req.headers.get('userId')

    if (!userId)
      return NextResponse.json(
        { error: 'user not authenticated' },
        { status: 403 }
      )

    try {
      const ownerId = await GetAllGainsDTOSchema.parseAsync(userId)

      const gains = await this.getAllGainsUseCase.execute(ownerId)

      if (!gains)
        return NextResponse.json({ error: 'owner not found' }, { status: 404 })

      return NextResponse.json({ gains })
    } catch (err) {
      if (err instanceof ZodError)
        return NextResponse.json(
          { errors: (err as ZodError).issues },
          { status: 400 }
        )

      return NextResponse.json(
        { error: (err as Error).message },
        { status: 500 }
      )
    }
  }
}
