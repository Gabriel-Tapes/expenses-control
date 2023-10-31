import { z } from 'zod'

export const CreateUserDTOSchema = z.object({
  name: z
    .string({ required_error: 'user name is required' })
    .nonempty({ message: 'user name cannot be empty' })
    .max(30, { message: 'user name max length is 30' }),
  lastName: z
    .string({ required_error: 'user lastName is required' })
    .nonempty({ message: 'user lastName cannot be empty' })
    .max(100, { message: 'user lastName max length is 100' }),
  email: z
    .string({ required_error: 'user email is required' })
    .email({ message: 'user email is not valid' }),
  password: z
    .string({ required_error: 'user password is required' })
    .min(8, { message: 'user password min length is 8' })
    .max(60, { message: 'user password max length is 60' })
})

export type CreateUserDTO = z.infer<typeof CreateUserDTOSchema>
