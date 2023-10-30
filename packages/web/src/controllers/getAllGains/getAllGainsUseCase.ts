import { IGainsRepository } from '@/repositories/IGainsRepository'
import { GetAllGainsDTO } from '@/types/DTO/get/getAllGainsDTO'

export class GetAllGainsUseCase {
  constructor(private gainsRepository: IGainsRepository) {}

  async execute(ownerId: GetAllGainsDTO) {
    const ownerExists = !!(await this.gainsRepository.getOwner(ownerId))

    if (!ownerExists) return null

    return await this.gainsRepository.getAllGains(ownerId)
  }
}
