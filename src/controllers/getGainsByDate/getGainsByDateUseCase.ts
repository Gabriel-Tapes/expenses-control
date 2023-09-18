import { IGainsRepository } from '@/repositories/IGainsRepository'
import { GetGainsByDateDTO } from '@/types/DTO/get/getGainsByDateDTO'

export class GetGainsByDateUseCase {
  constructor(private gainsRepository: IGainsRepository) {}

  async execute({ ownerId, startDate, endDate }: GetGainsByDateDTO) {
    const userExists = !!(await this.gainsRepository.getOwner(ownerId))

    if (!userExists) return null

    return this.gainsRepository.getGainsByDatePeriod(
      ownerId,
      startDate,
      endDate
    )
  }
}
