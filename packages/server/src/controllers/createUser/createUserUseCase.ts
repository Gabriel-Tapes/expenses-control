import { User } from '@/models/user'
import { IUsersRepository } from '@/repositories/IUsersRepository'
import { CreateUserDTO } from '@/types/DTO'
import { hash } from 'bcrypt'

export class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, lastName, email, password }: CreateUserDTO) {
    const user = new User({ name, lastName, email, password })

    user.password = await hash(user.password, 10)

    await this.usersRepository.createUser(user)

    return user
  }
}
