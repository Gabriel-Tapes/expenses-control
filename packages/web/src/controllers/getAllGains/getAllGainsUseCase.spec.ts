import {
  InMemoryGainsRepository,
  InMemoryUsersRepository
} from '@/repositories/inMemory'
import { GetAllGainsUseCase } from './getAllGainsUseCase'
import { gain } from '@tests/utils'

describe('GetAllGainsUseCase tests', () => {
  const usersRepository = new InMemoryUsersRepository()
  const gainsRepository = new InMemoryGainsRepository(usersRepository)
  const getAllGainsUseCase = new GetAllGainsUseCase(gainsRepository)

  beforeAll(async () => {
    await usersRepository.createUser(gain.owner)
    await gainsRepository.createGain(gain)
  })

  it('should return all gains', async () => {
    const gains = await getAllGainsUseCase.execute(gain.owner.id)

    expect(gains?.length).toBe(1)

    expect(gains).toEqual([gain])
  })

  it('should return an empty list if no gains are found', async () => {
    await gainsRepository.deleteGain(gain.owner.id, gain.id)

    const gains = await getAllGainsUseCase.execute(gain.owner.id)

    expect(gains?.length).toBe(0)
    await gainsRepository.createGain(gain)
  })

  it('should return null if owner not found', async () => {
    await usersRepository.deleteUser(gain.owner.id)

    const gains = await getAllGainsUseCase.execute(gain.owner.id)

    expect(gains).toBeNull()

    await usersRepository.createUser(gain.owner)
  })
})
