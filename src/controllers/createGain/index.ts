import { PostgresGainsRepository } from '@/repositories/implementations'
import { CreateGainUseCase } from './createGainUseCase'
import { CreateGainController } from './createGainController'

const gainsRepository = new PostgresGainsRepository()
const createGainUseCase = new CreateGainUseCase(gainsRepository)
const createGainController = new CreateGainController(createGainUseCase)

export { createGainController }
