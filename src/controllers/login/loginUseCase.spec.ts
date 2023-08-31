import { User } from '@/models/user'
import { InMemoryUsersRepository } from '@/repositories/inMemory'
import { hash } from 'bcrypt'
import { LoginUseCase } from './loginUseCase'
import { jwtVerify } from 'jose'

describe('LoginUseCase tests', () => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const usersRepositories = new InMemoryUsersRepository()
  const userData = {
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  }

  const user = new User({ ...userData })

  let loginUseCase: LoginUseCase

  beforeAll(async () => {
    user.password = await hash(user.password, 10)

    await usersRepositories.createUser(user)

    loginUseCase = new LoginUseCase(usersRepositories)
  })

  it('should return error 0 and token', async () => {
    const { error, token } = await loginUseCase.execute({
      email: userData.email,
      password: userData.password
    })

    expect(error).toBe(0)
    expect(token).toBeTruthy()
  })

  it('should return error 2 if a non-matching password is provided', async () => {
    const { error, token } = await loginUseCase.execute({
      email: userData.email,
      password: 'non-matching password'
    })

    expect(error).toBe(2)
    expect(token).not.toBeTruthy()
  })

  it('should return error 1 if a non-matching email is provided', async () => {
    const { error, token } = await loginUseCase.execute({
      email: 'wrong@test.dev',
      password: userData.password
    })

    expect(error).toBe(1)
    expect(token).not.toBeTruthy()
  })

  it('should get user id from token', async () => {
    const { token } = await loginUseCase.execute({
      email: userData.email,
      password: userData.password
    })
    const { id } = (await jwtVerify(token as string, secret)).payload

    expect(id).toEqual(user.id)
  })
})
