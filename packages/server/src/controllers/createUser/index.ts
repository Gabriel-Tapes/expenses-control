import { PostgresUsersRepository } from '@/repositories/implementations'
import { CreateUserUseCase } from './createUserUseCase'
import { CreateUserController } from './createUserController'

const usersRepository = new PostgresUsersRepository()
const createUserUseCase = new CreateUserUseCase(usersRepository)
const createUserController = new CreateUserController(createUserUseCase)

export { createUserController }
