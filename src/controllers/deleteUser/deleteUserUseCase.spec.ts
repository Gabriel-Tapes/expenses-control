import { User } from '@/models/user'
import { InMemoryUsersRepository } from '@/repositories/inMemory'
import { DeleteUserUseCase } from './deleteUserUseCase'

describe('DeleteUserUseCase tests', () => {
  const usersRepository = new InMemoryUsersRepository()
  const user = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  })
  const deleteUserUseCase = new DeleteUserUseCase(usersRepository)

  beforeEach(async () => {
    await usersRepository.createUser(user)
  })

  afterEach(async () => {
    await usersRepository.deleteUser(user.id)
  })

  it('should return error 0 and delete an user', async () => {
    const error = await deleteUserUseCase.execute(user.id)

    expect(error).toBe(0)
    expect(await usersRepository.getUserById(user.id)).toBeNull()
  })

  it('should return error 1 if user not found', async () => {
    const error = await deleteUserUseCase.execute('non-matching id')

    expect(error).toBe(1)
    expect(await usersRepository.getUserById(user.id)).toBeTruthy()
  })
})
