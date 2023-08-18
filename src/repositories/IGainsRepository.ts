import { Gain } from '@/models/gain'

export interface IGainsRepository {
  createGain(ownerId: string, gain: Gain): Promise<void>
  getGain(ownerId: string, gainId: string): Promise<Gain | null>
  getAllGains(ownerId: string): Promise<Gain[]>
  getGainsByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Gain[]>
  editGain(ownerId: string, editedGain: Gain): Promise<Gain | null>
  deleteGain(ownerId: string, gainId: string): Promise<void>
}
