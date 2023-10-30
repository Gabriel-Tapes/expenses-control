import {
  InMemoryGainsRepository,
  InMemoryUsersRepository
} from '@/repositories/inMemory'
import { GetGainsByDateUseCase } from './getGainsByDateUseCase'
import { gain, req } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('GetGainsUseCase tests', () => {
  const usersRepository = new InMemoryUsersRepository()
  const gainsRepository = new InMemoryGainsRepository(usersRepository)

  const getGainsByDateUseCase = new GetGainsByDateUseCase(gainsRepository)

  beforeAll(async () => {
    await usersRepository.createUser(gain.owner)
    await gainsRepository.createGain(gain)
  })

  it('should return gains at the date period', async () => {
    const gains = await getGainsByDateUseCase.execute({
      ownerId: gain.owner.id,
      startDate: new Date(gain.createdAt.getTime() - 10),
      endDate: new Date(gain.createdAt.getTime() + 10)
    })

    expect(gains.length).toBe(1)
    expect(gains[0]).toEqual(gain)
  })

  it('should return null if owner not exists in database', async () => {
    const gains = await getGainsByDateUseCase.execute({
      ownerId: randomUUID(),
      startDate: new Date(gain.createdAt.getTime() - 10),
      endDate: new Date(gain.createdAt.getTime() + 10)
    })

    expect(gains).toBeNull()
  })

  it('should return an empty list if a non-matching date period is provided', async () => {
    const gains = await getGainsByDateUseCase.execute({
      ownerId: gain.owner.id,
      startDate: new Date(gain.createdAt.getTime() + 10),
      endDate: new Date(gain.createdAt.getTime() + 20)
    })

    expect(gains.length).toBe(0)
  })
})
