import { z } from 'zod'

export const AuthMiddlewareDTOSchema = z
  .string({ required_error: 'no token provided' })
  .regex(/^Bearer [A-Za-z0-9_-]{2,}\.[A-Za-z0-9_-]{2,}\.[A-Za-z0-9_-]{2,}$/, {
    message: 'token malformatted'
  })
  .transform(value => value.split(' ')[1])

export type AuthMiddlewareDTO = z.infer<typeof AuthMiddlewareDTOSchema>
