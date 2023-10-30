import { IGainsRepository } from '@/repositories/IGainsRepository'
import { GetGainDTO } from '@/types/DTO'

export class GetGainUseCase {
  constructor(private gainsRepository: IGainsRepository) {}

  async execute({ ownerId, id }: GetGainDTO) {
    return await this.gainsRepository.getGain(ownerId, id)
  }
}
