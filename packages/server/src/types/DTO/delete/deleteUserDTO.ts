import { z } from 'zod'

export const DeleteUserDTOSchema = z
  .string({ required_error: 'user id is required' })
  .uuid({ message: 'invalid uuid' })

export type DeleteUserDTO = z.infer<typeof DeleteUserDTOSchema>
