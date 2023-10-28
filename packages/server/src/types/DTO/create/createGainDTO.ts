import Decimal from 'decimal.js'
import { z } from 'zod'

export const CreateGainDTOSchema = z.object({
  ownerId: z
    .string({ required_error: 'user id is required' })
    .uuid({ message: 'invalid uuid' }),
  value: z
    .number({ required_error: 'gain value is required' })
    .transform(value => new Decimal(value))
})

export type CreateGainDTO = z.infer<typeof CreateGainDTOSchema>
