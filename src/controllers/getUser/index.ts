import { PostgresUsersRepository } from '@/repositories/implementations'
import { GetUserUseCase } from './getUserUseCase'
import { GetUserController } from './getUserUseCase'

const usersRepository = new PostgresUsersRepository()
const getUserUseCase = new GetUserUseCase(usersRepository)
const getUserController = new GetUserController(getUserUseCase)

export { getUserController }
