import { z } from 'zod'

export const EditUserDTOSchema = z
  .object({
    id: z.string({ required_error: 'user id is required' }).uuid(),
    name: z
      .string()
      .nonempty({ message: 'user name cannot be empty' })
      .max(30, { message: 'user name max length is 30' })
      .optional(),
    lastName: z
      .string()
      .nonempty({ message: 'user name cannot be empty' })
      .max(100, { message: 'user name max length is 100' })
      .optional(),
    password: z
      .string()
      .min(8, { message: 'user password min length is 8' })
      .max(60, 'user password max length is 60')
      .optional()
  })
  .superRefine((val, ctx) => {
    if (!val.name && !val.lastName && !val.password)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one user optional key must be provided',
        fatal: true
      })
  })

export type EditUserDTO = z.infer<typeof EditUserDTOSchema>
