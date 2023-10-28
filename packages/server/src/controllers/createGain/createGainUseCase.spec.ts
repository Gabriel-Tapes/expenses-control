import {
  InMemoryGainsRepository,
  InMemoryUsersRepository
} from '@/repositories/inMemory'
import { CreateGainUseCase } from './createGainUseCase'
import { gain, user } from '@tests/utils'
import { randomUUID } from 'crypto'

describe('CreateGainsUseCase tests', () => {
  const usersRepository = new InMemoryUsersRepository()
  const gainsRepository = new InMemoryGainsRepository(usersRepository)
  const createGainUseCase = new CreateGainUseCase(gainsRepository)

  beforeAll(async () => {
    await usersRepository.createUser(user)
  })

  it('should create a gain', async () => {
    const {
      error,
      message,
      gain: createdGain
    } = await createGainUseCase.execute({
      ownerId: gain.owner.id,
      value: gain.value
    })

    expect(error).toBe(0)
    expect(message).toBe('success')

    expect(createdGain?.value).toEqual(gain.value)
    expect(createdGain?.owner).toEqual(gain.owner)
  })

  it('should not be able to create a gain with owner who is not in database', async () => {
    const {
      error,
      message,
      gain: createdGain
    } = await createGainUseCase.execute({
      ownerId: randomUUID(),
      value: gain.value
    })

    expect(error).toBe(1)
    expect(message).toBe('owner not found')
    expect(createdGain).toBeNull()
  })
})
