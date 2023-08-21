import { z } from 'zod'
import Decimal from 'decimal.js'

export const EditExpenseDTOSchema = z
  .object({
    id: z.string({ required_error: 'expense id is required' }).uuid(),
    ownerId: z.string({ required_error: 'expense ownerId is required' }).uuid(),
    categoryId: z.string().uuid().optional(),
    description: z
      .string()
      .nonempty({ message: 'expense description cannot be empty' })
      .max(200)
      .toLowerCase()
      .optional(),
    cost: z
      .number()
      .transform(value => new Decimal(value))
      .optional(),
    paidAt: z.date().optional()
  })
  .superRefine((val, ctx) => {
    if (!val.cost && !val.categoryId && !val.description && !val.paidAt)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one expense optional key must be provided',
        fatal: true
      })
  })

export type EditExpenseDTO = z.infer<typeof EditExpenseDTOSchema>
