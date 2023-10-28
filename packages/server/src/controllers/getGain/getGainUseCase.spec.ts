import { InMemoryGainsRepository } from '@/repositories/inMemory'
import { GetGainUseCase } from './getGainUseCase'
import { gain } from '@tests/utils'

describe('GetGainUseCase tests', () => {
  const gainsRepository = new InMemoryGainsRepository()

  const getGainUseCase = new GetGainUseCase(gainsRepository)

  beforeAll(async () => {
    await gainsRepository.createGain(gain)
  })

  it('should get gain', async () => {
    const gottenGain = await getGainUseCase.execute({
      ownerId: gain.owner.id,
      id: gain.id
    })

    expect(gottenGain).toEqual(gain)
  })

  it('should return null if a non-matching ownerId is provided', async () => {
    const gottenGain = await getGainUseCase.execute({
      ownerId: 'non-mathing ownerId',
      id: gain.id
    })

    expect(gottenGain).toBeNull()
  })

  it('should return null if a non-matching gainId is provided', async () => {
    const gottenGain = await getGainUseCase.execute({
      ownerId: gain.owner.id,
      id: 'non-matching gainId'
    })

    expect(gottenGain).toBeNull()
  })
})
