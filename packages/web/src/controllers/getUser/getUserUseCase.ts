import { IUsersRepository } from '@/repositories/IUsersRepository'
import { GetUserDTO } from '@/types/DTO/get/getUserDTO'

export class GetUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(id: GetUserDTO) {
    return this.usersRepository.getUserById(id)
  }
}
