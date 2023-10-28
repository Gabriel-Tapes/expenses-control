import { z } from 'zod'

export const GetUserDTOSchema = z
  .string({ required_error: 'id is required' })
  .uuid({ message: 'invalid user id' })

export type GetUserDTO = z.infer<typeof GetUserDTOSchema>
