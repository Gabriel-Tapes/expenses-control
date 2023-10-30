import { NextRequest, NextResponse } from 'next/server'
import { AuthMiddlewareUseCase } from './authMiddlewareUseCase'
import { AuthMiddlewareDTOSchema } from '@/types/DTO'
import { ZodError } from 'zod'

export class AuthMiddlewareController {
  constructor(private authMiddlewareUseCase: AuthMiddlewareUseCase) {}

  async handle(req: NextRequest) {
    try {
      const token = AuthMiddlewareDTOSchema.parse(
        req.headers.get('authorization')
      )

      const { error, id, message } =
        await this.authMiddlewareUseCase.execute(token)

      if (!error) {
        const reqHeaders = new Headers(req.headers)
        reqHeaders.set('x-user-id', id as string)

        return NextResponse.next({
          request: {
            headers: reqHeaders
          }
        })
      }

      const res = new NextResponse(
        JSON.stringify({
          success: false,
          message
        }),
        { status: error === 1 ? 403 : 400 }
      )

      if (error === 1) res.headers.set('www-authenticate', 'Bearer')

      return res
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
