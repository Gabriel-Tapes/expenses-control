import { PostgresUsersRepository } from '@/repositories/implementations'
import { DeleteUserUseCase } from './deleteUserUseCase'
import { DeleteUserController } from './deleteUserController'

const usersRepository = new PostgresUsersRepository()
const deleteUserUseCase = new DeleteUserUseCase(usersRepository)
const deleteUserController = new DeleteUserController(deleteUserUseCase)

export { deleteUserController }
