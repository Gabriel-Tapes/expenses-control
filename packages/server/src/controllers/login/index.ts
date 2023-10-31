import { PostgresUsersRepository } from '@/repositories/implementations'
import { LoginUseCase } from './loginUseCase'
import { LoginController } from './loginController'

const usersRepository = new PostgresUsersRepository()
const loginUseCase = new LoginUseCase(usersRepository)
const loginController = new LoginController(loginUseCase)

export { loginController }
