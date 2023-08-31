import { InMemoryUsersRepository } from '@/repositories/inMemory'
import { GetUserUseCase } from './getUserUseCase'
import { User } from '@/models/user'

describe('GetUserUseCase tests', () => {
  const usersRepository = new InMemoryUsersRepository()
  const getUserUseCase = new GetUserUseCase(usersRepository)

  const user = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  })

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
