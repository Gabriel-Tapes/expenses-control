import { randomUUID } from 'node:crypto'
import Decimal from 'decimal.js'
import { Client } from 'pg'
import { Expense } from '@/models/expense'
import {
  PostgresCategoriesRepository,
  PostgresExpensesRepository,
  PostgresUsersRepository
} from '@/repositories/implementations'
import { User } from '@/models/user'
import { Category } from '@/models/category'
import { getNewClient } from '@/infra/database'

describe('PostgresExpensesRepository tests', () => {
  const expensesRepository = new PostgresExpensesRepository()
  const expense = new Expense({
    ownerId: randomUUID(),
    categoryId: randomUUID(),
    description: 'test',
    cost: new Decimal(25)
  })

  let client: Client

  beforeAll(async () => {
    const usersRepository = new PostgresUsersRepository()
    const categoriesRepository = new PostgresCategoriesRepository()

    await usersRepository.createUser(
      new User(
        {
          name: 'joe',
          lastName: 'doe',
          email: 'joe.doe@exemple.com',
          password: '12345678'
        },
        expense.ownerId
      )
    )

    await categoriesRepository.addCategory(
      new Category({ name: 'test' }, expense.categoryId)
    )

    client = await getNewClient()
  })

  afterEach(async () => {
    await client.query('DELETE FROM expenses')
  })

  afterAll(async () => {
    await client.query('DELETE FROM users')
    await client.query('DELETE FROM categories')

    await client.end()
  })

  it('should create an expense', async () => {
    await expensesRepository.createExpense(expense)

    const { rows } = await client.query(
      'SELECT description, cost FROM expenses WHERE id = $1 and ownerId = $2 LIMIT 1',
      [expense.id, expense.ownerId]
    )

    expect(rows.length).toBe(1)

    const { description, cost } = rows[0]

    expect(description).toEqual(expense.description)
    expect(cost).toEqual(expense.cost.toString())
  })

  it('should get expense by id', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpense = await expensesRepository.getExpense(
      expense.ownerId,
      expense.id
    )

    expect(gottenExpense).toEqual(expense)
  })

  it('should return null if an non-matching id is provided', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpense = await expensesRepository.getExpense(
      expense.ownerId,
      randomUUID()
    )

    expect(gottenExpense).toBeNull()
  })

  it('should return null if an non-matching ownerId is provided', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpense = await expensesRepository.getExpense(
      randomUUID(),
      expense.id
    )

    expect(gottenExpense).toBeNull()
  })

  it('should get all expenses', async () => {
    await expensesRepository.createExpense(expense)
    await expensesRepository.createExpense(
      new Expense({
        ownerId: expense.ownerId,
        categoryId: expense.categoryId,
        description: 'test2',
        cost: new Decimal(20)
      })
    )

    const gottenExpenses = await expensesRepository.getAllExpenses(
      expense.ownerId
    )

    expect(gottenExpenses.length).toBe(2)
    expect(gottenExpenses[1]).toEqual(expense)
  })

  it('should return an empty list if no expenses are found', async () => {
    const gottenExpenses = await expensesRepository.getAllExpenses(
      expense.ownerId
    )

    expect(gottenExpenses).toEqual([])
  })

  it('should get expenses by date period', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpenses = await expensesRepository.getExpensesByDatePeriod(
      expense.ownerId,
      new Date(expense.createdAt.getTime() - 10),
      new Date(expense.createdAt.getTime() + 10)
    )

    expect(gottenExpenses.length).toBe(1)
    expect(gottenExpenses[0]).toEqual(expense)
  })

  it('should return an empty list if not expenses are found on data period', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpenses = await expensesRepository.getExpensesByDatePeriod(
      expense.ownerId,
      new Date(expense.createdAt.getTime() - 20),
      new Date(expense.createdAt.getTime() - 10)
    )

    expect(gottenExpenses.length).toBe(0)
  })

  it('should return an empty list if not expenses are found for ownerId', async () => {
    await expensesRepository.createExpense(expense)

    const gottenExpenses = await expensesRepository.getExpensesByDatePeriod(
      randomUUID(),
      new Date(expense.createdAt.getTime() - 10),
      new Date(expense.createdAt.getTime() + 10)
    )

    expect(gottenExpenses.length).toBe(0)
  })

  it('should edit an expense', async () => {
    await expensesRepository.createExpense(expense)

    const editedExpense = await expensesRepository.editExpense({
      id: expense.id,
      ownerId: expense.ownerId,
      description: 'edited description',
      cost: new Decimal(50),
      paidAt: new Date()
    })

    expect(editedExpense).toBeTruthy()
    expect(editedExpense?.categoryId).toEqual(expense.categoryId)
    expect(editedExpense?.description).toEqual('edited description')
    expect(editedExpense?.updatedAt).not.toEqual(expense.updatedAt)
  })

  it('should return null if a non-matching id is provided on editing', async () => {
    await expensesRepository.createExpense(expense)

    const editedExpense = await expensesRepository.editExpense({
      id: randomUUID(),
      ownerId: expense.ownerId,
      description: 'edited description',
      cost: new Decimal(50),
      paidAt: new Date()
    })

    expect(editedExpense).toBeNull()
  })

  it('should return null if a non-matching ownerId is provided on editing', async () => {
    await expensesRepository.createExpense(expense)

    const editedExpense = await expensesRepository.editExpense({
      id: expense.id,
      ownerId: randomUUID(),
      description: 'edited description',
      cost: new Decimal(50),
      paidAt: new Date()
    })

    expect(editedExpense).toBeNull()
  })

  it('should return 0 if expense found and deleted', async () => {
    await expensesRepository.createExpense(expense)

    const error = await expensesRepository.deleteExpense(
      expense.ownerId,
      expense.id
    )

    expect(error).toBe(0)
  })

  it('should return 1 if a non-matching id is provided on deleting', async () => {
    await expensesRepository.createExpense(expense)

    const error = await expensesRepository.deleteExpense(
      expense.ownerId,
      randomUUID()
    )

    expect(error).toBe(1)
  })

  it('should return 1 if a non-matching ownerId is provided on deleting', async () => {
    await expensesRepository.createExpense(expense)

    const error = await expensesRepository.deleteExpense(
      randomUUID(),
      expense.id
    )

    expect(error).toBe(1)
  })
})
