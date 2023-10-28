import { InMemoryUsersRepository } from '@/repositories/inMemory'
import { GetUserUseCase } from './getUserUseCase'
import { user } from '@tests/utils'

describe('GetUserUseCase tests', () => {
  const usersRepository = new InMemoryUsersRepository()
  const getUserUseCase = new GetUserUseCase(usersRepository)

  beforeAll(async () => {
    await usersRepository.createUser(user)
  })

  it('should return an user', async () => {
    const gottenUser = await getUserUseCase.execute(user.id)

    expect(gottenUser).toStrictEqual(user)
  })

  it('should return null if not user found', async () => {
    const gottenUser = await getUserUseCase.execute('invalid id')

    expect(gottenUser).toBeNull()
  })
})
