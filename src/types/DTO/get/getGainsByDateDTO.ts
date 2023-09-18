import { z } from 'zod'

export const GetGainsByDateDTOSchema = z
  .object({
    ownerId: z
      .string({ required_error: 'owner id is required' })
      .uuid({ message: 'invalid uuid' }),
    startDate: z.date(),
    endDate: z.date()
  })
  .transform(({ ownerId, startDate, endDate }) => {
    if (endDate.getTime() < startDate.getTime())
      [endDate, startDate] = [startDate, endDate]

    return { ownerId, startDate, endDate }
  })

export type GetGainsByDateDTO = z.infer<typeof GetGainsByDateDTOSchema>
