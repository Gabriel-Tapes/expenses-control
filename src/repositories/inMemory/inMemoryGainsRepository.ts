import { IGainsRepository } from '../IGainsRepository'
import { Gain } from '@/models/gain'
import { User } from '@/models/user'
import { EditGainDTO } from '@/types/DTO'
import { InMemoryUsersRepository } from '.'

export class InMemoryGainsRepository implements IGainsRepository {
  private usersRepository: InMemoryUsersRepository
  private gains: Gain[]

  constructor(usersRepository?: InMemoryUsersRepository) {
    this.gains = []
    this.usersRepository = usersRepository ?? new InMemoryUsersRepository()
  }

  async createGain(gain: Gain): Promise<void> {
    this.gains.push(
      new Gain(
        {
          owner: new User(
            {
              name: gain.owner.name,
              lastName: gain.owner.lastName,
              email: gain.owner.email,
              password: gain.owner.password
            },
            gain.owner.id,
            gain.owner.createdAt,
            gain.owner.updatedAt
          ),
          value: gain.value
        },
        gain.id,
        gain.createdAt,
        gain.updatedAt
      )
    )
  }
  async getOwner(ownerId: string): Promise<User | null> {
    return await this.usersRepository.getUserById(ownerId)
  }
  async getGain(ownerId: string, gainId: string): Promise<Gain | null> {
    return (
      this.gains.find(
        gain => gain.id === gainId && gain.owner.id === ownerId
      ) ?? null
    )
  }
  async getAllGains(ownerId: string): Promise<Gain[]> {
    return this.gains.filter(gain => gain.owner.id === ownerId)
  }
  async getGainsByDatePeriod(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Gain[]> {
    return this.gains.filter(
      gain =>
        gain.owner.id === ownerId &&
        gain.createdAt > startDate &&
        gain.createdAt < endDate
    )
  }
  async editGain({ id, ownerId, value }: EditGainDTO): Promise<Gain | null> {
    const gain = await this.getGain(ownerId, id)

    if (!gain) return null

    gain.value = value

    return gain
  }
  async deleteGain(ownerId: string, gainId: string): Promise<number> {
    const initialLength = this.gains.length

    this.gains.filter(gain => gain.owner.id !== ownerId && gain.id !== gainId)

    if (this.gains.length === initialLength) return 1

    return 0
  }
}
