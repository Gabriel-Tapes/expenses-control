import { InMemoryUsersRepository } from '@/repositories/inMemory'
import { EditUserUseCase } from './editUserUseCase'
import { user } from '@tests/utils'

describe('EditUserUseCase tests', () => {
  let usersRepository: InMemoryUsersRepository
  let editUserUseCase: EditUserUseCase

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    editUserUseCase = new EditUserUseCase(usersRepository)

    usersRepository.createUser(user)
  })

  it('should edit user with all fields provided', async () => {
    const editedUser = await editUserUseCase.execute({
      id: user.id,
      name: 'john',
      lastName: 'does',
      password: 'password'
    })

    expect(editedUser!.name).toBe('john')
    expect(editedUser!.lastName).toBe('does')
  })

  it('should id, email, and createdAt fields unchanged', async () => {
    const editedUser = await editUserUseCase.execute({
      id: user.id,
      name: 'john',
      lastName: 'does',
      password: 'password'
    })

    expect(editedUser!.id).toEqual(user.id)
    expect(editedUser!.email).toEqual(user.email)
    expect(editedUser!.createdAt).toEqual(user.createdAt)
    expect(editedUser!.password).not.toEqual(user.password)
  })

  it('should edit updatedAt field', async () => {
    const editedUser = await editUserUseCase.execute({
      id: user.id,
      name: 'john',
      lastName: 'does',
      password: 'password'
    })

    expect(editedUser!.updatedAt).not.toEqual(user.updatedAt)
    expect(editedUser!.updatedAt.getTime()).toBeGreaterThan(
      user.createdAt.getTime()
    )
  })

  it('should edited password saved as a hash', async () => {
    const editedUser = await editUserUseCase.execute({
      id: user.id,
      password: 'password'
    })

    expect(editedUser!.password).not.toEqual('password')
  })

  it('should edit user with only some fields', async () => {
    const editedUser = await editUserUseCase.execute({
      id: user.id,
      name: 'john'
    })

    expect(editedUser!.name).toEqual('john')
    expect(editedUser!.lastName).toEqual(user.lastName)
    expect(editedUser!.password).toEqual(user.password)
  })

  it('should return null if an non-matching id is provided', async () => {
    const editedUser = await editUserUseCase.execute({
      id: 'non-matching id',
      name: 'john'
    })

    expect(editedUser).toBeNull()
  })
})
