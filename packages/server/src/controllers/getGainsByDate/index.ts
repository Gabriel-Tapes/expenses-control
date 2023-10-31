import { PostgresGainsRepository } from '@/repositories/implementations'
import { GetGainsByDateUseCase } from './getGainsByDateUseCase'
import { GetGainsByDateController } from './getGainsByDateController'

const gainsRepository = new PostgresGainsRepository()
const getGainsByDateUseCase = new GetGainsByDateUseCase(gainsRepository)
const getGainsByDateController = new GetGainsByDateController(
  getGainsByDateUseCase
)

export { getGainsByDateController }
