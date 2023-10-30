import { z } from 'zod'

export const EditCategoryDTOSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string({ required_error: 'category name field is required' })
    .nonempty({ message: 'category name field cannot be empty' })
    .max(60, { message: 'category name max length is 60' })
})

export type EditCategoryDTO = z.infer<typeof EditCategoryDTOSchema>
