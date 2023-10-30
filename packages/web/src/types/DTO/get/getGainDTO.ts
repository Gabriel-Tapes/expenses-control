import { z } from 'zod'

export const GetGainDTOSchema = z.object({
  ownerId: z
    .string({ required_error: 'owner id is required' })
    .uuid({ message: 'invalid uuid' }),
  id: z
    .string({ required_error: 'gain id is required' })
    .uuid({ message: 'invalid uuid' })
})

export type GetGainDTO = z.infer<typeof GetGainDTOSchema>
