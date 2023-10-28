import { PostgresUsersRepository } from '@/repositories/implementations'
import { EditUserUseCase } from './editUserUseCase'
import { EditUserController } from './editUserController'

const usersRepository = new PostgresUsersRepository()
const editUserUseCase = new EditUserUseCase(usersRepository)
const editUserController = new EditUserController(editUserUseCase)

export { editUserController }
