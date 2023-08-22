import { IUsersRepository } from '@/repositories/IUsersRepository'
import { LoginDTO } from '@/types/DTO'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

export class LoginUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({ email, password }: LoginDTO) {
    const user = await this.usersRepository.getUserByEmail(email)

    if (!user) return { error: 1 }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) return { error: 2 }

    const oneWeek = 60 * 60 * 24 * 7
    const token = sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: oneWeek
    })

    return { error: 0, token }
  }
}
