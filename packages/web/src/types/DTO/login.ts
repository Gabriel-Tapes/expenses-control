import { z } from 'zod'

export const LoginDTOSchema = z.object({
  email: z
    .string({ required_error: 'email is required' })
    .email({ message: 'email mal-formated' }),
  password: z
    .string({ required_error: 'password is required' })
    .min(8, { message: 'password min length is 8' })
    .max(60, { message: 'password max length is 60' })
})

export type LoginDTO = z.infer<typeof LoginDTOSchema>
