import Decimal from 'decimal.js'
import { z } from 'zod'

export const EditGainDTOSchema = z.object({
  id: z.string({ required_error: 'gain id is required' }).uuid(),
  ownerId: z.string({ required_error: 'gain ownerId is required' }).uuid(),
  value: z
    .number({ required_error: 'gain value is required' })
    .transform(value => new Decimal(value))
})

export type EditGainDTO = z.infer<typeof EditGainDTOSchema>
