import { NextResponse, type NextRequest } from 'next/server'
import { GetGainUseCase } from './getGainUseCase'
import { ZodError } from 'zod'
import { GetGainDTOSchema } from '@/types/DTO'

export class GetGainController {
  constructor(private getGainUseCase: GetGainUseCase) {}

  async handle(req: NextRequest) {
    const userId = req.headers.get('userId')

    if (!userId)
      return NextResponse.json(
        { error: 'user is not authenticated' },
        { status: 403 }
      )

    try {
      const { id, ownerId } = await GetGainDTOSchema.parseAsync({
        ...(await req.json()),
        ownerId: userId
      })

      const gain = await this.getGainUseCase.execute({ ownerId, id })

      if (!gain)
        return NextResponse.json({ error: 'gain not found' }, { status: 404 })

      return NextResponse.json({ gain })
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
