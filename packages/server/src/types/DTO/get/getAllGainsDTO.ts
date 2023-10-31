import { z } from 'zod'

export const GetAllGainsDTOSchema = z
  .string()
  .uuid({ message: 'invalid user id' })

export type GetAllGainsDTO = z.infer<typeof GetAllGainsDTOSchema>
