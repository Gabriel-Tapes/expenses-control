import { IUsersRepository } from '@/repositories/IUsersRepository'
import { LoginDTO } from '@/types/DTO'
import { compare } from 'bcrypt'
import { SignJWT } from 'jose'

export class LoginUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ email, password }: LoginDTO) {
    const user = await this.usersRepository.getUserByEmail(email)

    if (!user) return { error: 1 }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) return { error: 2 }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1w')
      .sign(secret)

    return { error: 0, token }
  }
}
