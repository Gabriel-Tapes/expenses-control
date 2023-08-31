import { User } from '@/models/user'
import { PostgresUsersRepository } from '@/repositories/implementations'
import { getNewClient } from '@/infra/database'
import { type Client } from 'pg'
import { randomUUID } from 'crypto'

describe('PostgresUsersRepository tests', () => {
  const usersRepository = new PostgresUsersRepository()
  let client: Client

  const user = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  })

  beforeAll(async () => {
    client = await getNewClient()
  })

  afterEach(async () => {
    await client.query('DELETE FROM users')
  })

  afterAll(async () => {
    await client.end()
  })

  it('should create an user in database', async () => {
    await usersRepository.createUser(user)

    const { rows } = await client.query(
      'SELECT name, email FROM users WHERE id = $1 limit 1',
      [user.id]
    )

    expect(rows.length).toBe(1)

    const { name, email } = rows[0]

    expect(name).toEqual(user.name)
    expect(email).toEqual(user.email)
  })

  it('should get user by id', async () => {
    await usersRepository.createUser(user)

    const gottenUser = await usersRepository.getUserById(user.id)

    expect(gottenUser).toEqual(user)
  })

  it('should return null if an non-matching id is provided', async () => {
    await usersRepository.createUser(user)

    const gottenUser = await usersRepository.getUserById(randomUUID())

    expect(gottenUser).toBeNull()
  })

  it('should get user by email', async () => {
    await usersRepository.createUser(user)

    const gottenUser = await usersRepository.getUserByEmail(user.email)

    expect(gottenUser).toEqual(user)
  })

  it('should return null if an non-matching email is provided', async () => {
    await usersRepository.createUser(user)

    const gottenUser = await usersRepository.getUserByEmail(randomUUID())

    expect(gottenUser).toBeNull()
  })

  it('should edit an user', async () => {
    await usersRepository.createUser(user)

    const editedUser = await usersRepository.editUser({
      id: user.id,
      name: 'john',
      lastName: 'does',
      password: 'password'
    })

    expect(editedUser).toBeTruthy()
    expect(editedUser?.updatedAt).not.toEqual(user.updatedAt)
    expect(editedUser?.name).not.toEqual(user.name)
    expect(editedUser?.name).toBe('john')
    expect(editedUser?.email).toEqual(user.email)
  })

  it('should return null if an non-mathing id is provided in editUser', async () => {
    await usersRepository.createUser(user)

    const editedUser = await usersRepository.editUser({
      id: randomUUID(),
      name: 'john',
      lastName: 'does',
      password: 'password'
    })

    expect(editedUser).toBeNull()
  })

  it('should not change fields if it values are not provided', async () => {
    await usersRepository.createUser(user)

    const editedUser = await usersRepository.editUser({
      id: user.id
    })

    expect(editedUser).toBeTruthy()
    expect(editedUser?.name).toEqual(user.name)
    expect(editedUser?.lastName).toEqual(user.lastName)
    expect(editedUser?.password).toEqual(user.password)
  })

  it('should return 0 if user found and deleted', async () => {
    await usersRepository.createUser(user)

    const deleted = await usersRepository.deleteUser(user.id)

    expect(deleted).toBe(0)
  })

  it('should return 1 if user not found and deleted', async () => {
    await usersRepository.createUser(user)

    const deleted = await usersRepository.deleteUser(randomUUID())

    expect(deleted).toBe(1)
  })
})
