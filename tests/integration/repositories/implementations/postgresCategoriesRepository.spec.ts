import { getNewClient } from '@/infra/database'
import { Category } from '@/models/category'
import { PostgresCategoriesRepository } from '@/repositories/implementations'
import { randomUUID } from 'crypto'
import { type Client } from 'pg'

describe('PostgresCategoriesRepository tests', () => {
  const categoriesRepository = new PostgresCategoriesRepository()
  const category = new Category({ name: 'test' })

  let client: Client

  beforeAll(async () => {
    client = await getNewClient()
  })

  afterEach(async () => {
    await client.query('DELETE FROM categories')
  })

  afterAll(async () => {
    await client.end()
  })

  it('should add a category', async () => {
    await categoriesRepository.addCategory(category)

    const { rows } = await client.query(
      'SELECT name FROM categories WHERE id = $1',
      [category.id]
    )

    expect(rows.length).toBe(1)

    const { name } = rows[0]

    expect(name).toEqual(category.name)
  })

  it('should get a category by id', async () => {
    await categoriesRepository.addCategory(category)

    const gottenCategory = await categoriesRepository.getCategory(category.id)

    expect(gottenCategory).toBeTruthy()
    expect(gottenCategory).toBeInstanceOf(Category)
    expect(gottenCategory?.name).toEqual(category.name)
  })

  it('should return null if a non-matching id is provided', async () => {
    await categoriesRepository.addCategory(category)

    const gottenCategory = await categoriesRepository.getCategory(randomUUID())

    expect(gottenCategory).toBeNull()
  })

  it('should edit a category', async () => {
    await categoriesRepository.addCategory(category)

    const editedCategory = await categoriesRepository.editCategory({
      id: category.id,
      name: 'edited'
    })

    expect(editedCategory).toBeTruthy()
    expect(editedCategory?.name).toBe('edited')
    expect(editedCategory?.updatedAt).not.toEqual(category.updatedAt)
  })

  it('should return null if a non-matching id is provided on editing', async () => {
    await categoriesRepository.addCategory(category)

    const editedCategory = await categoriesRepository.editCategory({
      id: randomUUID(),
      name: 'edited'
    })

    expect(editedCategory).toBeNull()
  })

  it('should return 0 if found and delete category', async () => {
    await categoriesRepository.addCategory(category)

    const error = await categoriesRepository.deleteCategory(category.id)

    expect(error).toBe(0)
  })

  it('should return 1 if not found and delete category', async () => {
    await categoriesRepository.addCategory(category)

    const error = await categoriesRepository.deleteCategory(randomUUID())

    expect(error).toBe(1)
  })
})
