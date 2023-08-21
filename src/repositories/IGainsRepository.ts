import { type Gain } from '@/models/gain'
import { type EditGainDTO } from '@/types/DTO'

export interface IGainsRepository {
  createGain(gain: Gain): Promise<void>
  getGain(ownerId: string, gainId: string): Promise<Gain | null>
  getAllGains(ownerId: string): Promise<Gain[]>
  getGainsByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Gain[]>
  editGain({ id, ownerId, value }: EditGainDTO): Promise<Gain | null>
  deleteGain(ownerId: string, gainId: string): Promise<number>
}
