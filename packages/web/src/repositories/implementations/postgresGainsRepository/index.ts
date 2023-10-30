import { IGainsRepository } from '@/repositories/IGainsRepository'
import {
  createGain,
  deleteGain,
  editGain,
  getAllGains,
  getGain,
  getGainsByDatePeriod,
  getOwner
} from './methods'
import { type Gain } from '@/models/gain'
import { type User } from '@/models/user'
import { type EditGainDTO } from '@/types/DTO'

export class PostgresGainsRepository implements IGainsRepository {
  createGain(gain: Gain): Promise<void> {
    return createGain(gain)
  }
  getOwner(ownerId: string): Promise<User | null> {
    return getOwner(ownerId)
  }
  getGain(ownerId: string, gainId: string): Promise<Gain | null> {
    return getGain(ownerId, gainId)
  }
  getAllGains(ownerId: string): Promise<Gain[]> {
    return getAllGains(ownerId)
  }
  getGainsByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Gain[]> {
    return getGainsByDatePeriod(ownerId, startDate, endDate)
  }
  editGain(params: EditGainDTO): Promise<Gain | null> {
    return editGain({ ...params })
  }
  deleteGain(ownerId: string, gainId: string): Promise<number> {
    return deleteGain(ownerId, gainId)
  }
}
