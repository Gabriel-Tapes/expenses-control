import { IUsersRepository } from '@/repositories/IUsersRepository'
import { DeleteUserDTO } from '@/types/DTO/delete/deleteUserDTO'

export class DeleteUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(id: DeleteUserDTO) {
    return await this.usersRepository.deleteUser(id)
  }
}
