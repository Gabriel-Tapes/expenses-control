import { PostgresGainsRepository } from '@/repositories/implementations'
import { GetGainUseCase } from './getGainUseCase'
import { GetGainController } from './getGainController'

const gainsRepository = new PostgresGainsRepository()
const getGainUseCase = new GetGainUseCase(gainsRepository)
const getGainController = new GetGainController(getGainUseCase)

export { getGainController }
