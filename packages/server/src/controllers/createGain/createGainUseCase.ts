import { Gain } from '@/models/gain'
import { IGainsRepository } from '@/repositories/IGainsRepository'
import { CreateGainDTO } from '@/types/DTO'

export class CreateGainUseCase {
  constructor(private gainsRepository: IGainsRepository) {}

  async execute({ ownerId, value }: CreateGainDTO) {
    const owner = await this.gainsRepository.getOwner(ownerId)

    if (!owner) return { error: 1, message: 'owner not found', gain: null }

    const gain = new Gain({ owner, value })

    await this.gainsRepository.createGain(gain)

    return { error: 0, message: 'success', gain }
  }
}
