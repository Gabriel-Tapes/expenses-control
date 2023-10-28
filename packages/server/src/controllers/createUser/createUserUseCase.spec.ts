import { InMemoryUsersRepository } from '@/repositories/inMemory'
import { CreateUserUseCase } from './createUserUseCase'
import { User } from '@/models/user'

describe('CreateUserUseCase tests', () => {
  let usersRepository: InMemoryUsersRepository
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it('should be able to create an user', async () => {
    const createdUser = await createUserUseCase.execute({
      name: 'joe',
      lastName: 'doe',
      email: 'joe.doe@exemple.com',
      password: '12345678'
    })

    expect(createdUser).toBeInstanceOf(User)
    expect(createdUser.email).toEqual('joe.doe@exemple.com')
  })

  it('should stored password not the same', async () => {
    const createdUser = await createUserUseCase.execute({
      name: 'joe',
      lastName: 'doe',
      email: 'joe.doe@exemple.com',
      password: '12345678'
    })

    expect(createdUser.password).not.toEqual('12345678')
    expect(createdUser.password.length).toBe(60) // hash size
  })
})
