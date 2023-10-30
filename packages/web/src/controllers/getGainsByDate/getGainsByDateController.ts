import { NextRequest, NextResponse } from 'next/server'
import { GetGainsByDateUseCase } from './getGainsByDateUseCase'
import { ZodError } from 'zod'
import { GetGainsByDateDTOSchema } from '@/types/DTO/get/getGainsByDateDTO'

export class GetGainsByDateController {
  constructor(private getGainsByDateUseCase: GetGainsByDateUseCase) {}

  async handle(req: NextRequest) {
    const userId = req.headers.get('userId')

    if (!userId)
      return NextResponse.json(
        { error: 'user is not authenticated' },
        { status: 403 }
      )
    try {
      const { ownerId, startDate, endDate } =
        await GetGainsByDateDTOSchema.parseAsync({
          ...(await req.json()),
          ownerId: userId
        })

      const gains = await this.getGainsByDateUseCase.execute({
        ownerId,
        startDate,
        endDate
      })

      if (!gains)
        return NextResponse.json({ error: 'user not found' }, { status: 404 })

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
