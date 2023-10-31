import { IUsersRepository } from '@/repositories/IUsersRepository'
import { EditUserDTO } from '@/types/DTO'
import { hash } from 'bcrypt'

export class EditUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ id, name, lastName, password }: EditUserDTO) {
    const passwordHash = password ? await hash(password, 10) : undefined

    const editedUser = await this.usersRepository.editUser({
      id,
      name,
      lastName,
      password: passwordHash
    })

    return editedUser
  }
}
