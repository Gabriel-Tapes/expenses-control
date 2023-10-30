import { AuthMiddlewareController } from './authMiddlewareController'
import { AuthMiddlewareUseCase } from './authMiddlewareUseCase'

const authMiddlewareUseCase = new AuthMiddlewareUseCase()
const authMiddlewareController = new AuthMiddlewareController(
  authMiddlewareUseCase
)

export { authMiddlewareController }
