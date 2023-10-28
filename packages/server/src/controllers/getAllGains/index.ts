import { PostgresGainsRepository } from '@/repositories/implementations'
import { GetAllGainsUseCase } from './getAllGainsUseCase'
import { GetAllGainsController } from './getAllGainsController'

const gainsRepository = new PostgresGainsRepository()
const getAllGainsUseCase = new GetAllGainsUseCase(gainsRepository)
const getAllGainsController = new GetAllGainsController(getAllGainsUseCase)

export { getAllGainsController }
